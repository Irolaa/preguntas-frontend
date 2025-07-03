import { doGet, doDelete, doPut } from './http.service';
import { ReportedQuestion, DeleteQuestionResponse, DenyReportsResponse } from '../models/moderation.models';

export const getReportedQuestions = async (): Promise<ReportedQuestion[]> => {
  const path = '/api/private/questions/reports';
  const response = await doGet<ReportedQuestion[]>(path);
  return response;
}

export const deleteReportedQuestion = async (questionId: string): Promise<DeleteQuestionResponse> => {
  const path = `/api/private/questions/${questionId}`;
  const response = await doDelete<DeleteQuestionResponse>(path);
  return response;
};

export const denyQuestionReports = async (questionId: string): Promise<DenyReportsResponse> => {
  const path = `/api/private/questions/reports/deny/${questionId}`;
  const response = await doPut<void, DenyReportsResponse>(undefined, path);
  return response;
};