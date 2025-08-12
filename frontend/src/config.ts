export const BACKEND_URL = 'http://localhost:3002';

export const API_ROUTES = {
	auth: {
		login: `${BACKEND_URL}/auth/login`,
		register: `${BACKEND_URL}/auth/register`,
		loginGoogle: `${BACKEND_URL}/auth/google`,
	}, 
	me: `${BACKEND_URL}/me`,
	uploadAvatar: `${BACKEND_URL}/uploadAvatar`,
};