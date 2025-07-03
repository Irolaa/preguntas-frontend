import { LoginForm } from './types';
import {
  AuthenticationInput,
  AuthenticationResponse,
} from '../../models/users.models';
import { useApiHandler } from '../../hooks/useApiHandlers';
import { useSessionHandler } from '../../hooks/useSessionHandler';
import{ useNotificationHandler } from '../../hooks/notificationHandler';
import { login } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const useDependencies = () => {
  const { handleQuery } = useApiHandler();
  const { clearSession, setSessionStore } = useSessionHandler();
  const { setErrorNotification, setInfoNotification } = useNotificationHandler();
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: '',
  };

  const rules = {
    username: [
      {
        required: true,
        message: 'Por favor ingrese su usuario',
      },
    ],
    password: [
      {
        required: true,
        message: 'Por favor ingrese su contraseña',
      },
    ],
  };

  const handleLogin = async (values: LoginForm) => {
    const user: AuthenticationInput = {
      username: values.username,
      password: values.password,
    };

    clearSession();

    const { result, isError, message, statusCode } = await handleQuery(login, user);

    if (isError) {
      if (statusCode === 400) {
        setErrorNotification('Credenciales inválidas');
      } else {
        setErrorNotification(message);
      }
    } else {
      const response = result as AuthenticationResponse;

      if (response.token) {
        setSessionStore({ ...response });
        navigate('/home');
        setInfoNotification('Sesión iniciada correctamente');
      } else {
        setErrorNotification('Error al ingresar');
      }
    }
  };


  const handleCancel = () => {
  };

  return { initialValues, rules, handleLogin, handleCancel };
};

export default useDependencies;