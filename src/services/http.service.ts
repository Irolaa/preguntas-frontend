import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getJwtToken, getUsernameFromToken} from './cookies.service';
import { useNavigate } from 'react-router-dom';
import { useSessionHandler } from '../hooks/useSessionHandler';
import { useNotificationHandler } from '../hooks/notificationHandler';

const apiInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ----------------------------------- INTERCEPTORS ------------------------------------

// Interceptor para agregar el token antes de cada solicitud
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getJwtToken();
    const username = getUsernameFromToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (username) {
      config.headers.username = username;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar la respuesta (manejo de errores, token expirado, etc.)
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 40103) {
      const navigate = useNavigate();
      const { clearSession } = useSessionHandler();
      const { setErrorNotification } = useNotificationHandler();

      setErrorNotification("Sesión expirada");

      clearSession();

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
    return Promise.reject(error);
  }
);

// ----------------------------------- MÉTODOS AXIOS -----------------------------------

export const doPost = async <I, R>(payload: I, path: string): Promise<R> => {
  const response: AxiosResponse<R, I> = await apiInstance.post(path, payload);
  return response.data;
};

export const doPut = async <I, R>(payload: I, path: string): Promise<R> => {
  const response: AxiosResponse<R, I> = await apiInstance.put(path, payload);
  return response.data;
};

export const doGet = async <R>(path: string): Promise<R> => {
  const response: AxiosResponse<R> = await apiInstance.get(path);
  return response.data;
};

export const doPatch = async <I, R>(payload: I, path: string): Promise<R> => {
  const response: AxiosResponse<R, I> = await apiInstance.patch(path, payload);
  return response.data;
};

export const doDelete = async <R = void>(path: string): Promise<R> => {
  const response: AxiosResponse<R> = await apiInstance.delete(path);
  return response.data;
};