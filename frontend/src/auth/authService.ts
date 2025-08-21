import { API_ROUTES } from "../config";
import type { loginCredentials, registerCredentials } from "./types";

export async function google(): Promise<void> {
	window.location.href = `${API_ROUTES.auth.loginGoogle}`;
}

export async function login(credentials: loginCredentials): Promise<string> {
	const response = await fetch(`${API_ROUTES.auth.login}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(credentials),
	});

	if (!response.ok) {
		throw new Error('Login failed');
	}

	const data = await response.json();
	sessionStorage.setItem('has2fa', data.has2fa);
	
	return data.token;
}

export function saveToken(token: string): void {
	sessionStorage.setItem('token', token); //it will be stored in the browser
}

export function getToken(): string | null {
	return sessionStorage.getItem('token');
}

export function isAuthenticated(): boolean {
	return Boolean(getToken());
}

export async function register(credentials: registerCredentials): Promise<void> {
	const response = await fetch(`${API_ROUTES.auth.register}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(credentials),
	});

	if (!response.ok) {
		let errorMessage;

		try {
			const errorData = await response.json();
			if (errorData.message) {
				errorMessage = errorData.message;
			}
		} catch (e) {
			errorMessage = 'Register failed';
		}

		throw new Error(errorMessage);
	}

	await response.json();
}