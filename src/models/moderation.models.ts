export interface AnswerOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: string;
  isVisible: boolean;
  imageBase64: string;
  text: string;
  explanation: string;
  categories: Category[];
  answerOptions: AnswerOption[];
  createdAt: string;
  likes: number;
  dislikes: number;
}

export interface Report {
  reportId: string;
  userId: string;
  reason: string;
  description: string;
  reportedAt: string;
}

export interface ReportedQuestion {
  question: Question;
  reports: Report[];
}

export interface DeleteQuestionResponse {
  status: number;
  msg: string;
}

export interface DenyReportsResponse {
  status: number;
  msg: string;
}