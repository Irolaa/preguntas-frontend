
export type QuizHistoryItem = {
  id: string;
  date: string;
  category: string;
  score: string;
  answers: {
    [questionId: string]: string[];
  };
};