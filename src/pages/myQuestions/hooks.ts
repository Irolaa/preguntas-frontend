import { useEffect, useMemo, useState } from 'react';
import { verMisPreguntas, obtenerCategorias } from '../../services/question.service';
import { PreguntaResponse } from '../../models/preguntaResponse.model';

export const useMisPreguntas = () => {
  const [preguntas, setPreguntas] = useState<PreguntaResponse[]>([]);
  const [filtered, setFiltered] = useState<PreguntaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroDia, setFiltroDia] = useState<string | null>(null);
  const [ordenReciente, setOrdenReciente] = useState<'reciente' | 'viejo' | 'likes'>('reciente');

  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);
  const [categoriaInput, setCategoriaInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [preguntasData, categoriasData] = await Promise.all([
          verMisPreguntas(),
          obtenerCategorias()
        ]);
        setPreguntas(preguntasData);
        setFiltered(preguntasData);
        setCategoriasDisponibles(categoriasData.map(c => c.name));
      } catch (err) {
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let resultado = [...preguntas];

    if (filtroCategoria) {
      resultado = resultado.filter(p =>
        p.categories.some(c => c.name === filtroCategoria)
      );
    }

    if (filtroDia) {
      resultado = resultado.filter(p =>
        new Date(p.createdAt).toISOString().startsWith(filtroDia)
      );
    }

    resultado.sort((a, b) => {
      if (ordenReciente === 'likes') return b.likes - a.likes;
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return ordenReciente === 'reciente' ? db - da : da - db;
    });

    setFiltered(resultado);
  }, [preguntas, filtroCategoria, filtroDia, ordenReciente]);

  const categoriasFiltradas = useMemo(() => {
    const term = categoriaInput.toLowerCase();
    return categoriasDisponibles.filter(cat => cat.toLowerCase().includes(term));
  }, [categoriaInput, categoriasDisponibles]);

  return {
    preguntas: filtered,
    loading,
    error,
    setFiltroCategoria,
    setFiltroDia,
    setOrdenReciente,
    categoriasDisponibles,
    categoriaInput,
    setCategoriaInput,
    categoriasFiltradas,
    showDropdown,
    setShowDropdown,
    fechaSeleccionada,
    setFechaSeleccionada
  };
};
