import { useEffect, useState, useMemo } from 'react';
import { doPost, doGet } from '../../services/http.service';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { sugerirCategoriasIA } from '../../services/question.service';

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const usePreguntaForm = () => {
  const { setErrorNotification, setInfoNotification, setNotification } = useNotificationHandler();
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState<string[]>(['', '']);
  const [opcionesCorrectas, setOpcionesCorrectas] = useState<number[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);
  const [categoriaInput, setCategoriaInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [explicacion, setExplicacion] = useState('');
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [mostrarSugerenciasIA, setMostrarSugerenciasIA] = useState(false);
  const [categoriasSugeridas, setCategoriasSugeridas] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await doGet<any[]>('/api/private/questions/categories');
        setCategoriasDisponibles(res.map(c => c.name));
      } catch (error: any) {
        console.error('Error al cargar las categorías:', error);

        let errorMessage = 'Error al cargar las categorías disponibles';
        if (error.response && error.response.data && error.response.data.msg) {
          errorMessage = error.response.data.msg;
        } else if (error.message) {
          errorMessage = error.message;
        }
        setErrorNotification(errorMessage);
      }
    };
    fetchCategorias();
  }, [setNotification]);

  const filteredCategorias = useMemo(() => {
    const searchTerm = normalizeText(categoriaInput);
    
    let result = categoriasDisponibles;
    
    if (categoriaInput) {
      result = result.filter(cat => 
        normalizeText(cat).includes(searchTerm)
      );
    }
    
    return result.filter(cat => !categorias.includes(cat));
  }, [categoriaInput, categoriasDisponibles, categorias]);

  useEffect(() => {
    if (categorias.length >= 3) {
      setShowDropdown(false);
    }
  }, [categorias]);

  const handleOpcionChange = (index: number, value: string) => {
    const nuevas = [...opciones];
    nuevas[index] = value;
    setOpciones(nuevas);
    
    if (value.length > 150) {
      setErrorNotification('Las opciones no pueden exceder los 150 caracteres.');
    } else {
      setErrorNotification('');
    }
    
    if (value.trim() !== '' && index === opciones.length - 1) {
      setOpciones([...nuevas, '']);
    }
  };

  const eliminarOpcion = (index: number) => {
    const nuevas = opciones.filter((_, i) => i !== index);
    setOpciones(nuevas);
    setOpcionesCorrectas(opcionesCorrectas
      .filter(i => i !== index)
      .map(i => (i > index ? i - 1 : i))
    );
  };

  const toggleCorrecta = (index: number) => {
    setOpcionesCorrectas(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleCategoria = (categoria: string) => {
    setCategorias(prev => {
      if (prev.includes(categoria)) {
        return prev.filter(c => c !== categoria);
      } else if (prev.length < 3) {
        return [...prev, categoria];
      } else {
        setNotification({ type: 'error', message: 'Solo puedes seleccionar hasta 3 categorías' });
        return prev;
      }
    });
  };

  const obtenerSugerenciasIA = async () => {
    if (!pregunta.trim()) {
      setErrorNotification('Ingresa una pregunta para obtener sugerencias');
      return;
    }

    try {
      setIsCategorizing(true);
      const sugerencias = await sugerirCategoriasIA(pregunta.trim());
      const nombres = sugerencias.map(s => s.name);
      
      setCategoriasSugeridas(nombres);
      setMostrarSugerenciasIA(true);
      setInfoNotification('Sugerencias generadas. Selecciona las que apliquen');
      
    } catch (error: any) {
      console.error('Error al obtener sugerencias de IA:', error);

      let errorMessage = 'Error al obtener sugerencias de IA';

      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setErrorNotification(errorMessage);
    } finally {
      setIsCategorizing(false);
    }
  };

  const aceptarSugerencia = (categoria: string) => {
    if (categorias.length >= 3) {
      setNotification({ type: 'error', message: 'Máximo 3 categorías permitidas' });
      return;
    }
    setCategorias(prev => [...prev, categoria]);
    setCategoriasSugeridas(prev => prev.filter(c => c !== categoria));
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.match('image.*')) {
        reject(new Error('El archivo debe ser una imagen (JPEG, PNG, etc.)'));
        return;
      }

      const MAX_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        reject(new Error(`La imagen es demasiado grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). El tamaño máximo permitido es 2MB.`));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        
        if (!result.startsWith('data:image')) {
          reject(new Error('Formato de imagen no válido'));
          return;
        }

        resolve(result);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
    });
  };

  const enviarPregunta = async () => {
    const opcionesValidas = opciones.filter(op => op.trim() !== '');
    const hayOpcionesLargas = opcionesValidas.some(op => op.trim().length > 150);

    if (hayOpcionesLargas) {
      setErrorNotification('Todas las opciones deben tener como máximo 150 caracteres');
      return;
    }
    
    if (!pregunta.trim()) {
      setErrorNotification('La pregunta es obligatoria');
      return;
    }
    
    if (opcionesValidas.length < 2) {
      setErrorNotification('Al menos dos opciones deben estar completas');
      return;
    }

    if (opcionesCorrectas.length === 0) {
      setErrorNotification('Debes marcar al menos una opción como correcta');
      return;
    }

    if (categorias.length === 0) {
      setErrorNotification('Debes seleccionar al menos una categoría');
      return;
    }

    if (!explicacion.trim()) {
      setErrorNotification('La explicación es obligatoria');
      return;
    }

    try {
      const answerOptions = opcionesValidas
        .map((text, index) => ({
          text: text.trim(),
          isCorrect: opcionesCorrectas.includes(index),
        }));

      let payload: any = {
        text: pregunta.trim(),
        explanation: explicacion.trim(),
        answerOptions,
        categories: categorias,
      };

      if (archivo) {
        try {
          const imageBase64 = await toBase64(archivo);
          payload.imageBase64 = imageBase64;
        } catch (error: any) {
          console.error('Error al procesar el archivo adjunto:', error);
          let errorMessage = 'No se pudo procesar el archivo adjunto';
          if (error.message) {
            errorMessage = error.message;
          }
          setErrorNotification(errorMessage);
          return;
        }
      }

      await doPost<any, any>(payload, '/api/private/questions');
      
      setNotification({ type: 'success', message: 'Pregunta creada exitosamente' });
      
      setPregunta('');
      setOpciones(['', '']);
      setOpcionesCorrectas([]);
      setCategorias([]);
      setArchivo(null);
      setExplicacion('');
      setCategoriaInput('');
      setShowDropdown(false);
      setMostrarSugerenciasIA(false);
    } catch (error: any) {
      console.error('Error al enviar la pregunta:', error);

      let errorMessage = 'Error al enviar la pregunta';

      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setErrorNotification(errorMessage);
    }
  };

  return {
    pregunta,
    setPregunta,
    opciones,
    handleOpcionChange,
    eliminarOpcion,
    opcionesCorrectas,
    toggleCorrecta,
    categorias,
    categoriasDisponibles,
    toggleCategoria,
    categoriaInput,
    setCategoriaInput,
    filteredCategorias,
    showDropdown,
    setShowDropdown,
    archivo,
    setArchivo,
    explicacion,
    setExplicacion,
    enviarPregunta,
    isCategorizing,
    obtenerSugerenciasIA,
    mostrarSugerenciasIA,
    setMostrarSugerenciasIA,
    categoriasSugeridas,
    aceptarSugerencia
  };
};