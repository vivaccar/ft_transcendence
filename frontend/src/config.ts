export const BACKEND_URL = '/api';

export const API_ROUTES = {
	auth: {
		login: `${BACKEND_URL}/auth/login`,
		logout: `${BACKEND_URL}/auth/logout`,
		register: `${BACKEND_URL}/auth/register`,
		loginGoogle: `${BACKEND_URL}/auth/google`,
	}, 
	me: `${BACKEND_URL}/me`,
	uploadAvatar: `${BACKEND_URL}/uploadAvatar`,
	
	setup2FA: `${BACKEND_URL}/2fa/setup`,
	enable2FA: `${BACKEND_URL}/2fa/enable`,
	disable2FA: `${BACKEND_URL}/2fa/disable`,
	verify2FA: `${BACKEND_URL}/2fa/verify`,
};