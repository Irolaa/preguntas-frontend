import { Select, Button, InputNumber, Typography, Modal } from "antd";
import { useDependencies } from "./hooks";
import "../../components/quicesForm/quices.css";
import { FlagOff } from "lucide-react";

const { Title } = Typography;

export default function QuizPage() {
  const {
    categories,
    loading,
    selectedCategories,
    setSelectedCategories,
    questionLimit,
    setQuestionLimit,
    startQuiz,
    isReviewing,
    questionsToRender,
    reportModalVisible,
    reportReason,
    setReportReason,
    reportComment,
    setReportComment,
    score,
    grade,
    answers,
    handleModeSelect,
    handleQuizSubmit,
    openReportModal,
    closeReportModal,
    handleReportSubmit,
    resetQuiz,
    useQuizHandler,
    handleFinish,
  } = useDependencies();

  const { handleChange } = useQuizHandler(questionsToRender, handleFinish);

  return (
    <div className="quiz-container">
      {!startQuiz && !isReviewing && (
        <>
          <Title className="quiz-title">Seleccione Categorías (máx 3)</Title>
          <div className="quiz-filter-bar">
            <Select
              mode="multiple"
              placeholder="Seleccionar categorías"
              value={selectedCategories}
              onChange={setSelectedCategories}
              labelInValue
              style={{ minWidth: 240, marginRight: 8 }}
              maxTagCount={3}
              loading={loading}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="quiz-box-container">
            <div className="quiz-box">
              <h3>Rápido</h3>
              <p>5 preguntas</p>
              <Button type="primary" onClick={() => handleModeSelect("rapido")}>
                Generar Quiz
              </Button>
            </div>
            <div className="quiz-box">
              <h3>Normal</h3>
              <p>5 a 7 preguntas</p>
              <Button type="primary" onClick={() => handleModeSelect("normal")}>
                Generar Quiz
              </Button>
            </div>
            <div className="quiz-box">
              <h3>Largo</h3>
              <p>10 o más preguntas</p>
              <Button type="primary" onClick={() => handleModeSelect("largo")}>
                Generar Quiz
              </Button>
            </div>
            <div className="quiz-box">
              <h3>Personalizado</h3>
              <InputNumber
                min={1}
                max={15}
                placeholder="Cantidad"
                value={questionLimit ?? undefined}
                onChange={(val) => setQuestionLimit(val || null)}
                style={{ marginBottom: 12 }}
              />
              <Button
                type="primary"
                className="custom-quiz-button"
                onClick={() => handleModeSelect("personalizado")}
              >
                Generar Quiz
              </Button>
            </div>
          </div>
        </>
      )}

      {startQuiz && questionsToRender.length > 0 && (
        <div className="quiz-session">
          {questionsToRender.map((q) => (
            <div key={q.id} className="quiz-question-block">
              <div className="quiz-question-header">
                <div className="quiz-question-header-content">
                  <h3>{q.text}</h3>
                  <Button
                    shape="circle"
                    type="text"
                    onClick={() => openReportModal(q.realId)}
                    icon={<FlagOff size={18} color="#ff4d4f" />}
                  />
                </div>
                {q.image && (
                  <img src={q.image} alt="Pregunta" className="quiz-question-image" />
                )}
              </div>

              {q.answer_options.map((opt) => (
                <label
                  key={`${q.id}-${opt.id_answer_option}`}
                  className="quiz-answer-option"
                >
                  <input
                    type="checkbox"
                    name={`question-${q.id}`}
                    value={opt.id_answer_option}
                    checked={
                      isReviewing
                        ? opt.was_selected || false
                        : answers[q.id]?.includes(opt.id_answer_option) || false
                    }
                    disabled={isReviewing}
                    onChange={(e) => {
                      if (!isReviewing) {
                        handleChange(q.id, opt.id_answer_option, e.target.checked);
                      }
                    }}
                  />
                  <span
                    className={
                      isReviewing
                        ? opt.is_correct
                          ? "quiz-answer-correct"
                          : opt.was_selected && !opt.is_correct
                          ? "quiz-answer-incorrect"
                          : ""
                        : ""
                    }
                  >
                    {opt.text}
                  </span>
                  {isReviewing && opt.is_correct && <span style={{ marginLeft: 8 }}>✔</span>}
                  {isReviewing && opt.was_selected && !opt.is_correct && (
                    <span style={{ marginLeft: 8 }}>✖</span>
                  )}
                </label>
              ))}

              {/* Mostrar explicación cuando estamos en modo revisión */}
              {isReviewing && q.explanation && (
                <p className="quiz-explanation">
                  <strong>Explicación:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}

          {!isReviewing ? (
            <Button type="primary" onClick={handleQuizSubmit}>
              Enviar
            </Button>
          ) : (
            <div className="quiz-results">
              <h2>Resultado del Quiz</h2>
              <p>
                <strong>Puntuación:</strong> {grade} puntos
              </p>
              <p>
                <strong>Respuestas correctas:</strong> {score} de {questionsToRender.length}
              </p>
              <Button type="primary" onClick={resetQuiz}>
                Finalizar revisión
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal para reportar pregunta */}
      <Modal
        title="Reportar pregunta"
        open={reportModalVisible}
        onCancel={closeReportModal}
        onOk={handleReportSubmit}
        okText="Enviar reporte"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !reportReason }}
      >
        <div className="report-form">
          <h4 className="report-form-title">
            Selecciona el motivo del reporte:
          </h4>
          <ul className="report-reason-list">
            {[
              "Contenido inapropiado u ofensivo",
              "Pregunta confusa o ambigua",
              "Error en la pregunta o respuestas",
              "Pregunta duplicada",
              "Problemas de ortografía o gramática",
              "Nivel de dificultad incorrecto",
              "Otra razón",
            ].map((r) => (
              <li key={r} className="report-reason-item">
                <label>
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reportReason === r}
                    onChange={(e) => {
                      setReportReason(e.target.value);
                    }}
                  />
                  {r}
                </label>
              </li>
            ))}
          </ul>
          <textarea
            className="report-comment"
            placeholder="Comentarios adicionales (opcional)"
            value={reportComment}
            onChange={(e) => setReportComment(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}