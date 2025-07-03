import { useState, useEffect, useMemo } from 'react';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { useApiHandler } from '../../hooks/useApiHandlers';
import { 
  createQuiz, 
  getQuizById, 
  gradeQuiz, 
  fetchCategories, 
  fetchQuestionsByCategory, 
  reportQuestion 
} from '../../services/quiz.service';
import { Quiz, Question } from '../../models/quiz.models';
import { getUsernameFromToken } from '../../services/cookies.service';

export const useDependencies = () => {
  const { setNotification, setErrorNotification, setInfoNotification } = useNotificationHandler();
  const { handleQuery, handleMutation } = useApiHandler();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
  const [score, setScore] = useState<number | null>(null);
  const [grade, setGrade] = useState<number | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);
  const [startQuiz, setStartQuiz] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [questionsToRender, setQuestionsToRender] = useState<Question[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportingQuestionId, setReportingQuestionId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [reportComment, setReportComment] = useState<string>("");

  const getAllCategories = async (): Promise<{ id: string; name: string }[]> => {
    const { result, isError, message } = await handleQuery(fetchCategories, undefined);

    if (isError) {
      setErrorNotification(message);
      return [];
    }

    if (result && Array.isArray(result)) {
      if (typeof result[0] === "object" && result[0].id && result[0].name) {
        return result;
      } else if (typeof result[0] === "string") {
        return result.map((name: string, index: number) => ({
          id: index.toString(),
          name,
        }));
      }
    }

    return [];
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setErrorNotification('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const onCreateQuiz = async (categories: string[], totalQuestions: number) => {
    try {
      const { result, isError, message: apiMessage } = await handleMutation(createQuiz, { categories, totalQuestions });

      if (isError) {
        setErrorNotification(apiMessage || 'Error al crear el quiz');
        return null;
      }

      if (result) {
        setInfoNotification(result.msg || 'Quiz creado correctamente');
        return result;
      }

      return null;
    } catch (error) {
      console.error('Error creando quiz:', error);
      setErrorNotification('Error inesperado al crear el quiz');
      return null;
    }
  };

  const onGetQuizById = async (id: string) => {
    try {
      const { result, isError, message: apiMessage } = await handleQuery(getQuizById, id);

      if (isError) {
        setErrorNotification(apiMessage || 'Error al obtener el quiz');
        return null;
      }

      if (result) {
        setQuiz(result);
        return result;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo quiz:', error);
      setErrorNotification('Error inesperado al obtener el quiz');
      return null;
    }
  };

  const onGradeQuiz = async (quizId: string, payload: any) => {
    try {
      const { result, isError, message: apiMessage } = await handleMutation(gradeQuiz, { quizId, payload });

      if (isError) {
        setErrorNotification(apiMessage || 'Error al calificar el quiz');
        return null;
      }

      if (result) {
        setInfoNotification(result.msg || 'Quiz calificado correctamente');
        return result;
      }

      return null;
    } catch (error) {
      console.error('Error calificando quiz:', error);
      setErrorNotification('Error inesperado al calificar el quiz');
      return null;
    }
  };

  const onFetchQuestionsByCategory = async (category: string) => {
    try {
      const { result, isError, message: apiMessage } = await handleQuery(fetchQuestionsByCategory, category);

      if (isError) {
        setErrorNotification(apiMessage || 'Error al obtener las preguntas');
        return [];
      }

      if (result && Array.isArray(result)) {
        setQuestions(result);
        return result;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo preguntas por categoría:', error);
      setErrorNotification('Error inesperado al obtener las preguntas');
      return [];
    }
  };

  const onReportQuestion = async (
    username: string,
    question_id: string,
    reason: string,
    comment?: string
  ) => {
    try {
      const { result, isError, message: apiMessage } = await handleMutation(
        reportQuestion, 
        { username, question_id, reason, comment }
      );

      if (isError) {
        setErrorNotification(apiMessage || 'Error al reportar la pregunta');
        return { status: 500, msg: apiMessage || 'Error al reportar' };
      }

      if (result) {
        setInfoNotification(result.msg || 'Pregunta reportada correctamente');
        return { status: 201, msg: result.msg };
      }

      return { status: 201, msg: 'Pregunta reportada correctamente' };
    } catch (error: any) {
      console.error('Error reportando pregunta:', error);
      const msg = error?.response?.data?.msg || "Error al reportar";
      const status = error?.response?.status || 500;
      setErrorNotification(msg);
      return { status, msg };
    }
  };

  const handleFinish = ({ correct, total }: any) => {
    setInfoNotification(`Finalizaste el quiz con ${correct} de ${total} respuestas correctas.`);
    setIsReviewing(true);
    setStartQuiz(false);
  };

  const handleModeSelect = async (mode: "rapido" | "normal" | "largo" | "personalizado") => {
    let amount = 0;
    if (mode === "rapido")
      amount = Math.floor(Math.random() * 1) + 5; //Siempre es 5 por el backend
    else if (mode === "normal") amount = Math.floor(Math.random() * 3) + 5;
    else if (mode === "largo") amount = Math.floor(Math.random() * 6) + 10;
    else if (mode === "personalizado") amount = questionLimit || 0;

    if (selectedCategories.length === 0 || amount < 5 || amount > 15) {
      setErrorNotification(
        "Selecciona categorías y una cantidad válida de preguntas (5 a 15)."
      );
      return;
    }

    try {
      const response = await onCreateQuiz(
        selectedCategories.map((cat) => cat.label),
        amount
      );

      if (response?.msg?.includes("Quiz created successfully with ID")) {
        setNotification({
          type: "success",
          message: "Quiz creado exitosamente",
        });

        const id = response.msg.split(":").pop().trim();
        setQuizId(id);
        const quizData = await onGetQuizById(id);

        if (!quizData) return;

        const adapted = quizData.questions.map((q: any, index: number) => ({
          id: `q${index}`,
          realId: q.questionId,
          id_user: "user-001",
          username: q.username,
          rank: "N/A",
          text: q.text,
          image: q.image || null,
          explanation: "Explicación simulada",
          like: q.like,
          dislike: q.dislike,
          category: {
            id: q.categories?.[0]?.name?.toLowerCase() || "demo",
            name: q.categories?.[0]?.name || "Demo",
          },
          answer_options: q.answerOptions.map((a: any, i: number) => ({
            id_answer_option: `opt${index}-${i}`,
            real_id: a.id,
            text: a.text,
            is_correct: false,
          })),
        }));

        setQuestionsToRender(adapted);
        setStartQuiz(true);
      } else {
        setErrorNotification("No se pudo crear el quiz. Intenta nuevamente.");
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setErrorNotification(
          error.response.data?.message ||
            "No hay suficientes preguntas disponibles."
        );
      } else {
        setErrorNotification("Error inesperado al crear el quiz.");
      }
      setStartQuiz(false);
      setSelectedCategories([]);
      setQuestionLimit(null);
      resetScore();
    }
  };

  const handleQuizSubmit = async () => {
    if (!quizId) return;

    const formatted = questionsToRender.map((q) => ({
      questionID: q.realId,
      selectedAnswersId:
        answers[q.id]
          ?.map((optId) => {
            const opt = q.answer_options.find((a) => a.id_answer_option === optId);
            return opt?.real_id;
          })
          .filter((id) => id !== undefined) || [],
    }));

    try {
      const result = await onGradeQuiz(quizId, { questions: formatted });

      if (!result) return;

      setGrade(result.grade);

      let correctAnswers = 0;
      result.questionResults.forEach((qResult: any) => {
        const selectedIds = qResult.selectedOptions.map((opt: any) => opt.id);
        const correctIds = qResult.correctOptions.map((opt: any) => opt.id);
        
        if (selectedIds.length === correctIds.length && 
            selectedIds.every((id: any) => correctIds.includes(id))) {
          correctAnswers++;
        }
      });
      
      setScore(correctAnswers);

      const updatedQuestions = questionsToRender.map((q) => {
        const res = result.questionResults.find((r: any) => r.questionId === q.realId);
        if (!res) return q;

        const updatedOptions = q.answer_options.map((opt) => {
          const match = res.correctOptions.find((c: any) => c.id === opt.real_id);
          const selected = res.selectedOptions.find((s: any) => s.id === opt.real_id);

          return {
            ...opt,
            is_correct: !!match,
            was_selected: !!selected,
          };
        });

        return {
          ...q,
          explanation: res.explanation,
          answer_options: updatedOptions,
        };
      });

      setQuestionsToRender(updatedQuestions);
      setIsReviewing(true);
    } catch (e) {
      setErrorNotification("No se pudo calificar el quiz");
    }
  };

  const openReportModal = (questionId: string) => {
    setReportingQuestionId(questionId);
    setReportModalVisible(true);
  };

  const closeReportModal = () => {
    setReportModalVisible(false);
    setReportReason(null);
    setReportComment("");
  };

  const handleReportSubmit = async () => {
    if (!reportingQuestionId || !reportReason) {
      setErrorNotification("Faltan datos para enviar el reporte");
      return;
    }

    const username = getUsernameFromToken();

    if (!username) {
      setErrorNotification("No se pudo obtener el nombre de usuario.");
      return;
    }

    try {
      const response = await onReportQuestion(
        username,
        reportingQuestionId,
        reportReason,
        reportComment
      );

      if (response.status === 201) {
        setNotification({
          type: "success",
          message: "Reporte enviado exitosamente.",
        });
      } else {
        setErrorNotification(response.msg);
      }
    } catch (err: any) {
      setErrorNotification("Error al enviar el reporte.");
    }

    closeReportModal();
  };

  const resetScore = () => {
    setScore(null);
    setGrade(null);
    setAnswers({});
  };

  const resetQuiz = () => {
    setIsReviewing(false);
    setStartQuiz(false);
    setSelectedCategories([]);
    setQuestionLimit(null);
    setQuestionsToRender([]);
    setQuizId(null);
    resetScore();
  };

  const useQuizHandler = (questions: Question[], onFinish: any) => {
    const handleChange = (id: string, opt: string, checked: boolean) => {
      setAnswers((prev) => {
        const current = prev[id] || [];
        return {
          ...prev,
          [id]: checked ? [...current, opt] : current.filter((a) => a !== opt),
        };
      });
    };

    const handleSubmit = () => {
      let correct = 0;
      questions.forEach((q) => {
        const correctAnswers = q.answer_options.filter((a) => a.is_correct).map((a) => a.id_answer_option);
        const selected = answers[q.id] || [];
        const isCorrect =
          correctAnswers.length === selected.length &&
          correctAnswers.every((a) => selected.includes(a));
        if (isCorrect) correct++;
      });
      setScore(correct);
      onFinish({ correct, total: questions.length, answers, questions });
    };
    
    const setStartQuizState = (_: boolean) => {};

    return { answers, handleChange, handleSubmit, score, resetScore, setStartQuiz: setStartQuizState };
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    quiz,
    questions,
    categories,
    loading,
    answers,
    score,
    grade,
    selectedCategories,
    setSelectedCategories,
    questionLimit,
    setQuestionLimit,
    startQuiz,
    isReviewing,
    questionsToRender,
    quizId,
    reportModalVisible,
    reportingQuestionId,
    reportReason,
    setReportReason,
    reportComment,
    setReportComment,
    getAllCategories,
    loadCategories,
    onCreateQuiz,
    onGetQuizById,
    onGradeQuiz,
    onFetchQuestionsByCategory,
    onReportQuestion,
    useQuizHandler,
    handleFinish,
    handleModeSelect,
    handleQuizSubmit,
    openReportModal,
    closeReportModal,
    handleReportSubmit,
    resetQuiz,
  };
};