import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/login';
import Home from './pages/home';
import Quiz from './pages/quiz';
import QuizHistory from './pages/history';
import ResolvedQuizView from './pages/history/ResolvedQuizView';
import Register from './pages/register/index';
import { useSessionHandler } from './hooks/useSessionHandler';
import PreguntaForm from './components/preguntaForm/form';
import Sidebar from './components/sidebar/Sidebar';
import { Layout } from 'antd';
import { NotificationListener } from './components/notification/NotificationListener';
import { Profile } from './pages/profile';
import Welcome from './pages/welcome';
import { ModerationPanel } from './pages/moderation';
import VerificationCode from './pages/verificationCode';
import MyQuestionsPage from './pages/myQuestions';

const { Content } = Layout;

const App: React.FC = () => {
  const { sessionContext, loadSessionFromStorage, getRoleFromToken } = useSessionHandler();
  const [collapsed, setCollapsed] = useState(false);

  useMemo(() => {
    if (sessionContext === null) {
      loadSessionFromStorage();
    }
  }, [sessionContext, loadSessionFromStorage]);

  const role = sessionContext?.token ? getRoleFromToken(sessionContext.token) : null;

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const adminRoutes = () => (
    <>
      <Route path="/home" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/history" element={<QuizHistory />} />
      <Route path="/history/:id" element={<ResolvedQuizView />} />
      <Route path="/preguntas" element={<PreguntaForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mis-preguntas" element={<MyQuestionsPage />} />
      <Route path="/moderation" element={<ModerationPanel />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </>
  );

  const collaboratorRoutes = () => (
    <>
      <Route path="/home" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/history" element={<QuizHistory />} />
      <Route path="/history/:id" element={<ResolvedQuizView />} />
      <Route path="/preguntas" element={<PreguntaForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/mis-preguntas" element={<MyQuestionsPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </>
  );

  return (
    <ErrorBoundary
      description="Something went wrong, please contact an administrator"
      message="An unknown error occurred"
    >
      <Router>
        <NotificationListener />

        {!sessionContext ? (
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-code" element={<VerificationCode />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <UserProvider>
            <Layout className="min-h-screen transition-colors duration-300">
              <Sidebar
                collapsed={collapsed}
                role={role}
                toggleCollapsed={toggleCollapsed}
              />

              <Layout
                style={{
                  marginLeft: collapsed ? 80 : 250,
                  transition: 'margin-left 0.2s',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-color)'
                }}
              >
                <Content
                  style={{
                    padding: 24,
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-color)',
                  }}
                >
                  <Routes>
                    {role === 'ADMIN' && adminRoutes()}
                    {role === 'COLAB' && collaboratorRoutes()}
                    {!role && <Route path="*" element={<Navigate to="/login" replace />} />}
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </UserProvider>
        )}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
