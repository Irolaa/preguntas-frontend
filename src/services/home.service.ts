import { doGet } from './http.service';
import { Category } from '../pages/home/types';

export const getCategories = async(): Promise<Category[]> => {
  const path = '/api/private/questions/collaborator/random-categories'
  const response = await doGet<Category[]>(path)
  return response;
}

export const searchCategories = async (value: string): Promise<Category[]> => {
  try {
    const encodedTerm = encodeURIComponent(value);
    const path = `/api/private/questions/collaborator/search-categories?term=${encodedTerm}`;
    const response = await doGet<Category[]>(path);
    return response;
  } catch (error) {
    console.error('Error buscando categorías:', error);
    return [];
  }
};