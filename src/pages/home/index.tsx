import React, { useState, useEffect } from 'react';
import { Layout, Input, Typography } from 'antd';
import { Category } from './types';
import './styles.css';
import { useDependencies } from './hooks';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Home: React.FC = () => {
  const [setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { getAllCategories, handleSearch } = useDependencies();

  useEffect(() => {
    getAllCategories().then(response => {
      setCategories(response);
    });
  }, []);

  return (
    <Content className="home-content">
      <Search
        className="search-dark-compatible"
        placeholder="Buscar categorías"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        onSearch={async (value) => {
          const result = await handleSearch(value);
          setCategories(result);
        }}
        style={{ maxWidth: 400, marginBottom: 24 }}
      />

      <Title level={4}>Categorías Sugeridas</Title>

      <div className="container-categories">
        {categories.map((category) => (
          <div className="card-category" key={category.id}>
            <h3>{category.name}</h3>
            <p className="counter">{category.questions} preguntas</p>
          </div>
        ))}
      </div>
    </Content>
  );
};

export default Home;
