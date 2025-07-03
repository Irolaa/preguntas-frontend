import { doGet, doPost } from './http.service';
import { Quiz, Question, CreateQuizResponse, GradeQuizResponse, ReportQuestionResponse } from '../models/quiz.models';

export const createQuiz = async ({ categories, totalQuestions }: { categories: string[], totalQuestions: number }): Promise<CreateQuizResponse> => {
  const body = {
    categories,
    totalQuestions,
  };
  const path = '/api/private/questions/quizzes';
  const response = await doPost<typeof body, CreateQuizResponse>(body, path);
  return response;
};

export const getQuizById = async (id: string): Promise<Quiz> => {
  const path = `/api/private/questions/quizzes/${id}`;
  const response = await doGet<Quiz>(path);
  return response;
};

export const gradeQuiz = async ({ quizId, payload }: { quizId: string, payload: any }): Promise<GradeQuizResponse> => {
  const path = `/api/private/questions/quizzes/endtest/${quizId}`;
  const response = await doPost<any, GradeQuizResponse>(payload, path);
  return response;
};

export const fetchCategories = async (): Promise<string[]> => {
  const path = '/api/private/questions/categories';
  const response = await doGet<string[]>(path);
  return response;
};

export const fetchQuestionsByCategory = async (category: string): Promise<Question[]> => {
  const path = '/api/private/questions/questions';
  const response = await doGet<any[]>(path);
  
  const filtered = response.filter((q) =>
    q.categories.includes(category)
  );
  
  const adapted = filtered.map((q) => ({
    ...q,
    answer_options: q.answerOptions,
    category: {
      id: q.categories?.[0]?.toLowerCase().replace(/\s+/g, '-') || 'sin-categoria',
      name: q.categories?.[0] || 'Sin categoría',
    },
  }));
  
  return adapted;
};

export const reportQuestion = async ({
  username,
  question_id,
  reason,
  comment
}: {
  username: string,
  question_id: string,
  reason: string,
  comment?: string
}): Promise<ReportQuestionResponse> => {
  const payload = {
    question_id,
    reason,
    username,
    ...(comment ? { comment } : {}),
  };
  
  const path = '/api/private/questions/reports';
  const response = await doPost<typeof payload, ReportQuestionResponse>(payload, path);
  return response;
};