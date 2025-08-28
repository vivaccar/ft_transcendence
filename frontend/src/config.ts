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
	username: `${BACKEND_URL}/user/username`,
	password: `${BACKEND_URL}/user/password`,
	registerMatch: `${BACKEND_URL}/registerMatch`,
	ping: `${BACKEND_URL}/ping`,
	
	setup2FA: `${BACKEND_URL}/2fa/setup`,
	enable2FA: `${BACKEND_URL}/2fa/enable`,
	disable2FA: `${BACKEND_URL}/2fa/disable`,
	verify2FA: `${BACKEND_URL}/2fa/verify`,

	getMatches: (username: string) => `${BACKEND_URL}/users/${username}/getMatches`,
	getWinsAndLosses: (username: string) => `${BACKEND_URL}/users/${username}/getWinsAndLosses`,
	getGoals: (username: string) => `${BACKEND_URL}/users/${username}/getGoals`,
};