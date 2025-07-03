import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useDependencies } from './hook';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/animatedPage/animatedPage';

import './styles.css';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { handleSubmit, validatePassword } = useDependencies();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="register-wrapper">
        <div className="register-card">
          <Typography.Title className="register-title" level={3}>
            Registro
          </Typography.Title>

          <Form
            form={form}
            name="register"
            layout="vertical"
            className="register-form"
            onFinish={(values: FormValues) => {
              handleSubmit({ ...values });
              form.resetFields();
            }}
          >
            <Form.Item
              name="username"
              label="Nombre de Usuario"
              rules={[{ required: true, message: 'Por favor ingresa un nombre de usuario' }]}
            >
              <Input placeholder="Nombre de Usuario" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'Por favor ingresa un correo válido' },
              ]}
            >
              <Input placeholder="Correo Electrónico" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: 'Por favor ingresa tu contraseña' },
                { validator: (_, value) => validatePassword(value) },
              ]}
            >
              <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirmar Contraseña"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Por favor confirma tu contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden.'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirmar Contraseña" />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <Button type="default" className="cancel-button" onClick={() => form.resetFields()} block>
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit" block>
                  Registrarse
                </Button>
              </div>
            </Form.Item>
          </Form>

          <div className="register-footer-link">
            <Button
              type="link"
              size="large"
              block
              onClick={() => navigate('/login')}
              style={{ fontSize: '16px' }}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Register;
