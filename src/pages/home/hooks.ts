import { useApiHandler } from '../../hooks/useApiHandlers';
import { getCategories, searchCategories } from '../../services/home.service';
import { Category } from './types';

export const useDependencies = () => {
  const { handleQuery } = useApiHandler();

  const getAllCategories = async (): Promise<Category[]> => {
    const { result, isError, message } = await handleQuery(getCategories, undefined);

    if (isError) {
      console.log(message);
      return [];
    }

    if (result && Array.isArray(result.categories)) {
      return result.categories;
    }

    return [];
  }

  const handleSearch = async (value: string): Promise<Category[]> => {
    const { result, isError, message } = await handleQuery(searchCategories, value);

    if (isError) {
      console.log(message);
      return [];
    }

    if (result && Array.isArray(result.categories)) {
      return result.categories;
    }

    return [];
  }

  return { getAllCategories, handleSearch };
};
