import {
	AuthenticationInput,
	AuthenticationResponse,
} from '../models/users.models';
import { doPost } from './http.service';
import { UserRegisterRequest } from '../models/users.models';


export const registerUser = async (
	user: UserRegisterRequest

): Promise<Response> => {
	const response = await doPost<UserRegisterRequest, Response>(user, '/api/public/auth/register');

	return response;
};

export const login = async (
	user: AuthenticationInput
): Promise<AuthenticationResponse> => {
	const result = await doPost<AuthenticationInput, AuthenticationResponse>(
		user,
		'/api/public/auth/login'
	);
	return result;
};

export const verifyCode = async (email: string, code: string): Promise<Response> => {
	return await doPost<{ email: string; code: string }, Response>(
		{ email, code },
		'/api/public/auth/verify'
	);
};
