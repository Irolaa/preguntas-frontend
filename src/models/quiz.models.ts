export type AnswerOption = {
  id_answer_option: string;
  text: string;
  is_correct: boolean;
  real_id?: number;
  was_selected?: boolean; 
};

export type Question = {
  realId(realId: any): unknown;
  id: string;
  id_user: string;
  username: string;
  rank: string;
  text: string;
  image: string | null;
  explanation: string;
  like: number;
  dislike: number;
  category: {
    id: string;
    name: string;
  };
  answer_options: AnswerOption[];
};

export type Quiz = {
  id: string;
  id_user: string;
  grade: number;
  completed: string;
  status: 'in_progress' | 'completed' | string;
  end_time: string;
  questions: Question[];
  answers: {
    [questionId: string]: string[];
  };
};

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

export type CreateQuizResponse = {
  id: string;
  msg: string;
};

export type GradeQuizResponse = {
  grade: number;
  msg: string;
};

export type ReportQuestionResponse = {
  msg: string;
};