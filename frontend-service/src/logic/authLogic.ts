import { login, saveToken, register } from '../auth/authService';
import { buildRegisterPage } from '../pages/registerPage';

export function setupAuthLogic(): void {
	const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
	if (!loginForm) return;

	loginForm.addEventListener('submit', (event) => setupLoginLogic(event));
	document.getElementById('go-to-register')?.addEventListener('click', setupRegisterLogic);
}

async function setupLoginLogic(event: Event): Promise<void> {
	event.preventDefault();

	const username = (document.querySelector<HTMLInputElement>('#username')!)?.value;
	const password = (document.querySelector<HTMLInputElement>('#password')!)?.value;
	try {
	  const token = await login({ username, password });
	  saveToken(token);
	  alert('Success login');
	  // navegar para outra parte da app
	} catch (err) {
	  alert(err);
	}	
}

function setupRegisterLogic(): void {
	buildRegisterPage();

	const registerForm = document.querySelector<HTMLFormElement>('#registerForm');
	if (!registerForm) return;

	// registerForm.addEventListener('submit', async (event) => {
	// 	event.preventDefault();

	// 	// alert('Success login');
	// })
}