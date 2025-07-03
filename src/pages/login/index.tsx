import { Button, Card, Divider, Form, Input, Typography } from 'antd';
import useDependencies from './hooks';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/animatedPage/animatedPage';

import './styles.css';

const Login = () => {
  const { handleLogin, rules } = useDependencies();
  const navigate = useNavigate();

  const goToRegister = () => navigate('/register');

  return (
    <AnimatedPage>
      <div className="login-wrapper">
        <Card
          className="login-card"
          title={
            <Typography.Title className="login-title" level={3}>
              Iniciar Sesión
            </Typography.Title>
          }
        >
          <Form
            onFinish={handleLogin}
            autoComplete="off"
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              label="Nombre de usuario"
              name="username"
              rules={rules.username}
            >
              <Input placeholder="Ingresa tu nombre de usuario" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={rules.password}
            >
              <Input.Password placeholder="Ingresa tu contraseña" />
            </Form.Item>

            <Button
              type="primary"
              shape="round"
              size="large"
              htmlType="submit"
              block
            >
              Ingresar
            </Button>
          </Form>

          <Divider>O</Divider>

          <div className="login-footer-link">
            <Button
              type="link"
              size="large"
              block
              onClick={goToRegister}
              style={{ fontSize: '16px' }}
            >
              Crea una nueva cuenta
            </Button>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default Login;
