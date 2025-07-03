
import { AxiosError } from 'axios';
import { ErrorResponse } from '../models/api.models';

export const useApiHandler = () => {

	const handleMutation = async <TInput, TResult>(
		call: (input: TInput) => Promise<TResult>,
		input: TInput
		) => {
		let isError = false;
		let isSuccess = true;
		let message = 'Process executed successfully';
		let result;
		let statusCode: number | undefined;

		try {
		result = await call(input);
		statusCode = 200;
		return { result, isSuccess, isError, message, statusCode };
		} catch (e) {
		if (e instanceof AxiosError) {
			const axiosError = e as AxiosError;
			result = axiosError.response;
			statusCode = result?.status;
			const error = result?.data as ErrorResponse;
			if (error !== null) {
				message = error.message;
				isError = true;
				isSuccess = false;
				return { error, isSuccess, isError, message, statusCode };
			}
		}
		throw e;
		}
	};

	const handleQuery = async <TInput, TResult>(
		call: (input: TInput) => Promise<TResult>,
		input: TInput
		) => {
		let isError = false;
		let message = 'Process executed successfully';
		let result;
		let statusCode: number | undefined;

		try {
			result = await call(input);
			statusCode = 200;
			return { result, isError, message, statusCode };
		} catch (e) {
			if (e instanceof AxiosError) {
			const axiosError = e as AxiosError;
			result = axiosError.response;
			statusCode = result?.status;
			const error = result?.data as ErrorResponse;
			if (error !== null) {
				message = error.message;
				isError = true;
				return { result, isError, message, statusCode };
			}
			}
			throw e;
		}
	};


	return { handleMutation, handleQuery };
};
