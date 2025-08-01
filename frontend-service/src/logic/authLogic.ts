import { login, saveToken } from '../auth/authService';

export function setupAuthLogic(): void {
	const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
	if (!loginForm) return;

	loginForm.addEventListener('submit', async (event) => {
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
	})
}

// function setupLoginLogic(): void {
	
// }