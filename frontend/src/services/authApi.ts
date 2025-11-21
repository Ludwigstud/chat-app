import { api } from "./apiClient";
import { LoginData, RegistrationData, AuthResponse } from "@chat-app/shared/types.js";

export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
	const path = "/auth/login";

	const response = await api<AuthResponse>(path, {
		method: "POST",
		body: JSON.stringify(credentials),
	});

	localStorage.setItem("token", response.token);

	return response;
};

export const registerUser = async (credentials: RegistrationData): Promise<AuthResponse> => {
	const path = "/auth/register";

	const response = await api<AuthResponse>(path, {
		method: "POST",
		body: JSON.stringify(credentials),
	});

	localStorage.setItem("token", response.token);

	return response;
};

export const logoutUser = (): void => {
	localStorage.removeItem("token");
};
