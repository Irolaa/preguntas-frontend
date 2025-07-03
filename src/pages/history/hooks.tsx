import { useApiHandler } from '../../hooks/useApiHandlers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

export default function useDependencies() {
  const { handleQuery } = useApiHandler();

  const fetchQuizHistory = async () =>
  handleQuery(
    () =>
      api.get('/quiz_history').then(res => {
        return res.data.map((item: any) => ({
          ...item,
          date: item.completed, 
          score: item.grade?.toString() ?? '0', 
          category: item.questions?.[0]?.category?.name ?? 'Sin categoría', 
        }));
      }),
    null
  );


  return { fetchQuizHistory };
}