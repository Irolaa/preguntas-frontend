import { verifyCode } from '../../services/auth.service';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { useNavigate } from 'react-router-dom';
import { useApiHandler } from '../../hooks/useApiHandlers';

export const useDependencies = () => {
	const { setErrorNotification, setInfoNotification } = useNotificationHandler();
	const { handleMutation } = useApiHandler();
	const navigate = useNavigate();

	const handleSubmit = async (code: string) => {
		const email = localStorage.getItem('pendingEmail');

		if (!email) {
			setErrorNotification('Sesión de verificación inválida. Registrate nuevamente.');
			navigate('/register');
			return;
		}

		const { isError, message } = await handleMutation(() => verifyCode(email, code), { email, code });

		if (isError) {
			setErrorNotification(message);
			return;
		}

		localStorage.removeItem('pendingEmail');
		localStorage.removeItem('pendingPassword');
		localStorage.removeItem('pendingUsername');

		setInfoNotification('Cuenta verificada. Iniciá sesión para continuar');
		navigate('/login');
	};

	return { handleSubmit };
};
