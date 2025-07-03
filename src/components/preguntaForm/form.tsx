import React from 'react';
import './styles.css';
import { FiTrash2, FiUpload, FiCheckCircle, FiX, FiChevronDown } from 'react-icons/fi';
import { usePreguntaForm } from './hook';
import { NotificationListener } from '../notification/NotificationListener';


import { Avatar } from 'antd'; 
import { UserOutlined } from '@ant-design/icons';
import { useUser } from '../../contexts/UserContext'; 


const PreguntaForm: React.FC = () => {
  const {
    pregunta, setPregunta,
    opciones, handleOpcionChange, eliminarOpcion,
    opcionesCorrectas, toggleCorrecta,
    categorias,  toggleCategoria,
    categoriaInput, setCategoriaInput, filteredCategorias,
    showDropdown, setShowDropdown,
    archivo, setArchivo,
    explicacion, setExplicacion,
    enviarPregunta,
    isCategorizing,
    obtenerSugerenciasIA,
    mostrarSugerenciasIA,
    setMostrarSugerenciasIA,
    categoriasSugeridas,
    aceptarSugerencia
  } = usePreguntaForm();

  const { userData, loading } = useUser();
  
  const renderHeaderAvatar = () => {
    if (loading) {
        return <Avatar size={64} icon={<UserOutlined />} />;
    }
    if (userData.profileImage) {
        return (
            <Avatar
                size={64}
                src={userData.profileImage}
                alt={userData.username}
            />
        );
    }
    return <Avatar size={64} icon={<UserOutlined />} />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white transition-colors duration-300 p-4 flex justify-center">
      <div className="card w-full max-w-3xl">
        <NotificationListener />

        <div className="header">
          {renderHeaderAvatar()}
          <div className="header-text-container"> 
            <h2>Crea una nueva pregunta</h2>
            <p>Comparte tu conocimiento con la comunidad</p>
          </div>
        </div>

        <label>Tu pregunta *</label>
        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          data-testid="pregunta-textarea"
        />

        <label>Opciones de respuesta *</label>
        {opciones.map((op, idx) => (
          <div key={idx} className="option-row" data-testid={`opcion-row-${idx}`}>
            <input
              type="text"
              placeholder={`Opción ${idx + 1}`}
              value={op}
              onChange={(e) => handleOpcionChange(idx, e.target.value)}
              data-testid={`opcion-input-${idx}`}
            />
            {opciones.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarOpcion(idx)}
                title="Eliminar opción"
                data-testid={`eliminar-opcion-${idx}`}
              >
                <FiTrash2 />
              </button>
            )}
            <input
              type="checkbox"
              className="correct-checkbox"
              checked={opcionesCorrectas.includes(idx)}
              onChange={() => toggleCorrecta(idx)}
              title="Marcar como correcta"
              data-testid={`correcta-checkbox-${idx}`}
            />
          </div>
        ))}

        <label>Explicación de la respuesta *</label>
        <textarea
          value={explicacion}
          onChange={(e) => setExplicacion(e.target.value)}
          placeholder="Explica por qué esta(s) respuesta(s) es/son correctas..."
          data-testid="explicacion-textarea"
        />

        <label>Categorías *</label>
        <div className="selected-categories">
          {categorias.map(cat => (
            <span key={cat} className="category-tag" data-testid={`categoria-tag-${cat}`}>
              {cat}
              <button
                type="button"
                onClick={() => toggleCategoria(cat)}
                data-testid={`eliminar-categoria-${cat}`}
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="combobox-container">
          <input
            type="text"
            value={categoriaInput}
            onChange={(e) => {
              setCategoriaInput(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar o seleccionar categorías..."
            data-testid="categoria-input"
          />
          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setShowDropdown(!showDropdown)}
            data-testid="categoria-toggle"
          >
            <FiChevronDown />
          </button>
          {showDropdown && (
            <div className="categories-dropdown" data-testid="categoria-dropdown">
              {filteredCategorias.length > 0 ? (
                filteredCategorias.map(cat => (
                  <div
                    key={cat}
                    className="category-item"
                    onClick={() => {
                      toggleCategoria(cat);
                      setCategoriaInput('');
                      setShowDropdown(false);
                    }}
                    data-testid={`categoria-item-${cat}`}
                  >
                    {cat}
                  </div>
                ))
              ) : (
                <div className="no-results">No se encontraron categorías</div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="categorizar-ia"
          data-testid="categorizar-ia-btn"
          onClick={obtenerSugerenciasIA}
          disabled={isCategorizing || categorias.length >= 3}
        >
          {isCategorizing ? (
            'Generando sugerencias...'
          ) : (
            <>
              <FiCheckCircle style={{ marginRight: '6px' }} />
              Categorizar con IA
            </>
          )}
        </button>

        {mostrarSugerenciasIA && (
          <div className="sugerencias-ia-box">
            <div className="sugerencias-header">
              <span>Sugerencias de IA</span>
              <button
                onClick={() => setMostrarSugerenciasIA(false)}
                className="cerrar-sugerencias"
              >
                <FiX />
              </button>
            </div>

            {categoriasSugeridas.length > 0 ? (
              <div className="lista-sugerencias">
                {categoriasSugeridas.map((cat, index) => (
                  <div key={index} className="sugerencia-item">
                    <span>{cat}</span>
                    <button
                      onClick={() => aceptarSugerencia(cat)}
                      disabled={categorias.includes(cat)}
                    >
                      Añadir
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sin-sugerencias">
                No se encontraron sugerencias automáticas
              </div>
            )}
          </div>
        )}

        <label>Material de apoyo (opcional)</label>
        <div className="upload-area" data-testid="upload-area">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            data-testid="file-input"
          />
          <label htmlFor="file">
            <FiUpload size={20} />
            <span style={{ marginLeft: '8px' }}>
              Arrastra archivos aquí o haz clic para subir
            </span>
            <small>Formatos: JPG, PNG, JPEG (máx. 2MB)</small>
          </label>
          {archivo && archivo.type.startsWith('image/') && (
            <img
              src={URL.createObjectURL(archivo)}
              alt="preview"
              style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }}
              data-testid="image-preview"
            />
          )}
        </div>

        <div className="actions">
          <button
            type="button"
            className="submit"
            onClick={enviarPregunta}
            data-testid="submit-btn"
          >
            <FiUpload style={{ marginRight: '6px' }} />
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreguntaForm;