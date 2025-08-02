export const API_GATEWAY_URL = 'http://localhost:3000';

export const API_ROUTES = {
  auth: {
	login: '${API_GATEWAY_URL}/auth/login',
	loginGoogle: '${API_GATEWAY_URL}/auth/google',
  }
};