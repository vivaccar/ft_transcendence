import { API_ROUTES } from "../config";
import type { loginCredentials } from "./types";

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
	return data.token;
}

export function saveToken(token: string): void {
	localStorage.setItem('token', token); //it will be stored in the browser
}

export function getToken(): string | null {
	return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
	return Boolean(getToken());
}