import { Question } from '../quiz/types';

export type QuizHistoryItem = {
  id: string;
  date: string;
  category: string;
  score: string;
  questions: Question[];
  answers: {
    [questionId: string]: string[];
  };
};