export interface Categoria {
  id: number;
  name: string;
}

export interface AnswerOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface PreguntaResponse {
  id: string;
  text: string;
  explanation: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  categories: Categoria[];
  answerOptions: AnswerOption[];
}
