import { login, saveToken, register, google} from '../auth/authService';
import { navigate } from '../router';

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
		
		
		navigate('./dashboard');

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
		alert('Success login');
		navigate('./dashboard');
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

