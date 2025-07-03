import { doPost, doGet } from './http.service';
import { PreguntaPayload} from '../models/pregunta.model';
import { PreguntaResponse } from '../models/preguntaResponse.model';

export interface Categoria {
  id: number;
  name: string;
}

export interface CategoriaIASugerida {
  id: number;
  name: string;
}

export const crearPregunta = async (data: PreguntaPayload): Promise<any> => {
  return await doPost<PreguntaPayload, any>(data, '/api/private/questions');
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  return await doGet<Categoria[]>('/api/private/questions/categories');
};

export const sugerirCategoriasIA = async (pregunta: string): Promise<CategoriaIASugerida[]> => {
  return await doPost<{ question: string }, CategoriaIASugerida[]>(
    { question: pregunta },
    '/api/private/questions/suggestions'
  );
};

export const verMisPreguntas = async (): Promise<PreguntaResponse[]> => {
  return await doGet<PreguntaResponse[]>('/api/private/questions');
};
