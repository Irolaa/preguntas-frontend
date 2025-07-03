import { useMisPreguntas } from './hooks';
import './styles.css';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Clock3,
  ThumbsUp,
  ThumbsDown,
  Check
} from 'lucide-react';
import { FiChevronDown, FiX, FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

const MyQuestionsPage = () => {
  const {
    preguntas,
    loading,
    error,
    setFiltroCategoria,
    setFiltroDia,
    setOrdenReciente,
    categoriaInput,
    setCategoriaInput,
    categoriasFiltradas,
    showDropdown,
    setShowDropdown,
    fechaSeleccionada,
    setFechaSeleccionada
  } = useMisPreguntas();

  if (loading) return <p className="loading">Cargando preguntas...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-questions-container">
      <h2>Mis Preguntas</h2>

      {/* Filtros */}
      <div className="filters">
        <div className="categoria-filtro-container">
          <input
            type="text"
            value={categoriaInput}
            onChange={(e) => {
              setCategoriaInput(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar o seleccionar categoría..."
          />

          {categoriaInput && (
            <button
              type="button"
              className="categoria-clear"
              onClick={() => {
                setCategoriaInput('');
                setFiltroCategoria(null);
              }}
            >
              <FiX size={16} />
            </button>
          )}

          <button
            type="button"
            className="categoria-toggle"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FiChevronDown size={18} />
          </button>

          {showDropdown && (
            <div className="categoria-dropdown">
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((cat) => (
                  <div
                    key={cat}
                    className="categoria-item-filtro"
                    onClick={() => {
                      setFiltroCategoria(cat);
                      setCategoriaInput(cat);
                      setShowDropdown(false);
                    }}
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

        <div className="datepicker-wrapper">
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(date) => {
              setFechaSeleccionada(date);
              setFiltroDia(date ? format(date, 'yyyy-MM-dd') : null);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Filtrar por fecha"
            className="datepicker-custom"
            isClearable
          />
          <FiCalendar className="datepicker-icon" />
        </div>

        <select onChange={(e) => setOrdenReciente(e.target.value as any)}>
          <option value="reciente">Más recientes primero</option>
          <option value="viejo">Más antiguas primero</option>
          <option value="likes">Más likeadas</option>
        </select>
      </div>

      {/* Preguntas */}
      {preguntas.length === 0 ? (
        <p className="empty-state">No has creado ninguna pregunta aún.</p>
      ) : (
        preguntas.map((pregunta) => (
          <div key={pregunta.id} className="my-question-card">
            <h3>{pregunta.text}</h3>
            <p><strong>Explicación:</strong> {pregunta.explanation}</p>

            <div className="my-question-meta">
              <span>
                <Clock3 size={16} style={{ marginRight: 4 }} />
                {new Date(pregunta.createdAt).toLocaleString()}
              </span>
              <span>
                <ThumbsUp size={16} style={{ marginRight: 4, color: 'var(--success)' }} />
                {pregunta.likes}
                <ThumbsDown size={16} style={{ marginLeft: 12, marginRight: 4, color: 'var(--danger)' }} />
                {pregunta.dislikes}
              </span>
            </div>

            <div className="my-question-categorias">
              <strong>Categorías:</strong>
              <ul>
                {pregunta.categories.map((cat) => (
                  <li key={cat.id}>{cat.name}</li>
                ))}
              </ul>
            </div>

            <div className="my-question-opciones">
              <strong>Opciones:</strong>
              <ul>
                {pregunta.answerOptions.map((opt) => (
                  <li key={opt.id} className={opt.isCorrect ? 'correct' : ''}>
                    {opt.text}
                    {opt.isCorrect && <Check size={16} style={{ color: 'var(--success)', marginLeft: 6 }} />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyQuestionsPage;
