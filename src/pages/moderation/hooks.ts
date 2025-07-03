import { useState, useEffect, useMemo } from 'react';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { useApiHandler } from '../../hooks/useApiHandlers';
import { getReportedQuestions, deleteReportedQuestion, denyQuestionReports} from '../../services/moderation.service';
import { ReportedQuestion } from '../../models/moderation.models';

export const useDependencies = () => {
  const { setErrorNotification, setInfoNotification } = useNotificationHandler();
  const { handleQuery, handleMutation } = useApiHandler();

  const [searchId, setSearchId] = useState('');
  
  const [questions, setQuestions] = useState<ReportedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllReportedQuestions = async (): Promise<ReportedQuestion[]> => {
    const { result, isError, message } = await handleQuery(getReportedQuestions, undefined);

    if (isError) {
      setErrorNotification(message);
      return [];
    }

    if (result && Array.isArray(result)) {
      return result;
    }

    return [];
  }

  const loadReportedQuestions = async () => {
    setLoading(true);
    try {
      const reportedQuestions = await getAllReportedQuestions();
      setQuestions(reportedQuestions);
    } catch (error) {
      console.error('Error loading reported questions:', error);
      setErrorNotification('Error al cargar las preguntas reportadas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportedQuestions();
  }, []);

  const onDeleteQuestion = async (questionId: string) => {
    try {
      const { result, isError, message: apiMessage } = await handleMutation(deleteReportedQuestion, questionId);

      if (isError) {
        setErrorNotification(apiMessage || 'Error al eliminar la pregunta');
        return;
      }

      if (result) {
        setInfoNotification(result.msg || 'Pregunta eliminada correctamente');
      } else {
        setInfoNotification('Pregunta eliminada correctamente');
      }

      setQuestions(prevQuestions => 
        prevQuestions.filter(reportedQuestion => 
          reportedQuestion.question.id !== questionId
        )
      );
      
    } catch (error) {
      console.error('Error eliminando pregunta:', error);
      setErrorNotification('Error inesperado al eliminar la pregunta');
    }
  };

  const onRejectReport = async (questionId: string) => {
    try {
      const { result, isError, message: apiMessage } = await handleMutation(denyQuestionReports, questionId);

      if (isError) {
        setErrorNotification(apiMessage || 'Error al rechazar el reporte');
        return;
      }

      if (result) {
        setInfoNotification(result.msg || 'Reporte rechazado correctamente');
      } else {
        setInfoNotification('Reporte rechazado correctamente');
      }

      setQuestions(prevQuestions => 
        prevQuestions.filter(reportedQuestion => 
          reportedQuestion.question.id !== questionId
        )
      );
      
    } catch (error) {
      console.error('Error rechazando reporte:', error);
      setErrorNotification('Error inesperado al rechazar el reporte');
    }
  };

  const filteredQuestions = useMemo(() => {
    if (!searchId.trim()) {
      return questions;
    }
    return questions.filter(reportedQuestion => 
      reportedQuestion.question.id.toString().includes(searchId.trim())
    );
  }, [questions, searchId]);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const clearSearch = () => {
    setSearchId('');
  };

  return {
    questions,
    loading,
    getAllReportedQuestions,
    loadReportedQuestions,
    onDeleteQuestion,
    onRejectReport,
    filteredQuestions,
    handleSearchChange,
    clearSearch,
    searchId
  }
}