import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import useDependencies from './hooks';
import '../../components/quicesForm/quices.css';
import { QuizHistoryItem } from './types';

export default function QuizHistory() {
  const { fetchQuizHistory } = useDependencies();
const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  async function loadHistory() {
    const { result, isError } = await fetchQuizHistory();
    if (!isError && Array.isArray(result)) {
      setHistory(result as QuizHistoryItem[]);
    }
  }
  loadHistory();
}, []);


  const columns = [
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    { title: 'Categoría', dataIndex: 'category', key: 'category' },
    { title: 'Puntaje', dataIndex: 'score', key: 'score' },
    {
      title: 'Acciones',
      key: 'action',
      render: (_: any, record: { id: string }) => (
        <Button type="link" onClick={() => navigate(`/home/history/${record.id}`)}>
          Ver resultados
        </Button>
      ),
    },
  ];

  return (
    <div className="quiz-container">
      <h1 className="quiz-history-title">Historial de Tests</h1>
      <Table
        className="quiz-history-table"
        columns={columns}
        dataSource={history.map((item: any, i: number) => ({ ...item, key: i.toString() }))}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}