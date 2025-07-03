import { UserRegisterRequest } from '../../models/users.models';
import { RegisterUserForm } from './types';
import { registerUser } from '../../services/auth.service';
import { useApiHandler } from '../../hooks/useApiHandlers';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { useNavigate } from 'react-router-dom';

export const useDependencies = () => {
	const { handleMutation } = useApiHandler();
	const { setErrorNotification } = useNotificationHandler();
	const navigate = useNavigate();

	const validatePassword = (value: string) => {
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&.])[A-Za-z\d@$!%.?&]{8,}$/;
		if (!value || passwordRegex.test(value)) {
			return Promise.resolve();
		}
		return Promise.reject(
			new Error(
				'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
			)
		);
	};
	
	const handleSubmit = async (parms: RegisterUserForm) => {
		const request: UserRegisterRequest = {
			username: parms.username,
			email: parms.email,
			password: parms.password,
		};

		const { isError, message } = await handleMutation(registerUser, request);

		if (isError) {
			setErrorNotification(message);
		} else {
			localStorage.setItem('pendingEmail', parms.email);
			localStorage.setItem('pendingPassword', parms.password);
			localStorage.setItem('pendingUsername', parms.username);
			navigate('/verify-code');
		}
	};


	return { handleSubmit, validatePassword };
};