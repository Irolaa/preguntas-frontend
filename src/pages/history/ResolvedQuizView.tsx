import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import { Question } from '../../models/quiz.models';
import { QuizHistoryItem } from './types';
import useDependencies from './hooks';
import '../../components/quicesForm/quices.css';

export default function ResolvedQuizView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchQuizHistory } = useDependencies();
  const [quiz, setQuiz] = useState<QuizHistoryItem | null>(null);

  useEffect(() => {
  async function loadResolved() {
    const { result, isError } = await fetchQuizHistory();
    if (!isError && Array.isArray(result)) {
      const found = (result as QuizHistoryItem[]).find((q) => q.id === id);
      setQuiz(found || null);
    }
  }
  loadResolved();
}, [id]);


  if (!quiz) return <Alert message="Resultado no encontrado" type="error" />;

  return (
    <div className="quiz-container">
      <Button onClick={() => navigate('/home/history')} className="quiz-back-button">
        ← Volver al historial
      </Button>

      <h1 className="quiz-title">Resultado del Quiz</h1>
      <p className="quiz-subtitle">
        Categoría: <strong>{quiz.category}</strong> | Fecha: {quiz.date} | Puntaje: {quiz.score}
      </p>

      <div>
        {quiz.questions.map((q: Question) => (
          <div key={q.id} className="quiz-question-block">
            <h3>{q.text}</h3>
            {q.answer_options.map((opt) => {
              const isSelected = quiz.answers[q.id]?.includes(opt.id_answer_option);
              const isCorrect = opt.is_correct;

              return (
                <div key={opt.id_answer_option} className="quiz-answer-option">
                  <input type="checkbox" checked={isSelected} disabled />
                  <span
                    className={
                      isCorrect
                        ? 'quiz-answer-correct'
                        : isSelected
                        ? 'quiz-answer-incorrect'
                        : undefined
                    }
                  >
                    {opt.text}
                  </span>
                  {isCorrect && <span style={{ marginLeft: 8 }}>✔</span>}
                  {isSelected && !isCorrect && <span style={{ marginLeft: 8 }}>✖</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}