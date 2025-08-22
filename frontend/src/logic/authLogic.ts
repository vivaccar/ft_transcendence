import { login, saveToken, register, google} from '../auth/authService';
import { navigate } from '../router';
import { login2FA } from '../auth/2fa';
import { getCookieValue } from '../utils';
import { API_ROUTES } from '../config';


export function setupAuthLogic(): void {
	const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
	if (!loginForm) return;

	loginForm.addEventListener('submit', (event) => setupLoginLogic(event));
	document.getElementById('go-to-register')?.addEventListener('click', (event) => {
		event.preventDefault();
		navigate('./register'); 
	  });
	document.getElementById('googleBtn')?.addEventListener('click', setupGoogleLogic);
}

async function setupGoogleLogic(event: Event): Promise<void> {
	event.preventDefault();

	try {
		await google();
	  } catch (err) {
		alert(err);
	  }
}

async function setupLoginLogic(event: Event): Promise<void> {
	event.preventDefault();

	const username = (document.querySelector<HTMLInputElement>('#usernameLogin')!)?.value;
	const password = (document.querySelector<HTMLInputElement>('#passwordLogin')!)?.value;
	try {
		const token = await login({ username, password });
	  	saveToken(token);
	  	if (getCookieValue('has2fa') === 'true'){
			login2FA();
		} else {
			navigate("/dashboard");
	  	}
	} catch (err) {
	  alert(err);
	}	
}

export function setupRegisterLogic(): void {  
	const registerForm = document.querySelector<HTMLFormElement>('#registerForm');
	if (!registerForm) return;
  
	registerForm.addEventListener('submit', async (event) => {
	  event.preventDefault();
  
	  try {
		const email = (document.querySelector<HTMLInputElement>('#emailRegister')!).value;
		const username = (document.querySelector<HTMLInputElement>('#usernameRegister')!).value;
		const password = (document.querySelector<HTMLInputElement>('#passwordRegister')!).value;
  
		await register({ email, username, password });
		alert('Success register');
  
		navigate('./login');
	  } catch (err) {
		alert(err);
	  }
	});
  }

export async function isAuthenticated(): Promise<boolean> {
	try {
		const res = await fetch(API_ROUTES.me, {
		method: "GET",
		credentials: "include"
		});
  
	return res.ok; 
	} catch (e) {
		console.error(e);
		return false;
	}
}

export function protectedRoute(handler: () => void | Promise<void>) {
	return async () => {
	  if (!(await isAuthenticated())) {
		navigate("/login");
		return;
	  }
	  await handler();
	};
}

export async function logoutLogic(): Promise<void> {
	try {
		const res = await fetch(API_ROUTES.auth.logout, {
		method: "POST",
		credentials: "include"
		});
  
		if(res.ok){
			navigate('./login');
		} else {
			alert('Logout can\'t be happened.');
		}
	} catch (e) {
		console.error(e);
	}
}
