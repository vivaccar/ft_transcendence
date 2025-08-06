import { login, saveToken, register, google} from '../auth/authService';
import { buildDashboard } from '../pages/dashboardPage';
// import { buildRegisterPage } from '../pages/registerPage';

export function setupAuthLogic(): void {
	const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
	if (!loginForm) return;

	loginForm.addEventListener('submit', (event) => setupLoginLogic(event));
	document.getElementById('go-to-register')?.addEventListener('click', setupRegisterLogic);
	document.getElementById('googleBtn')?.addEventListener('click', setupGoogleLogic);
}

async function setupGoogleLogic(event: Event): Promise<void> {
	event.preventDefault();

	try {
		/* const token =  */await google();
		//saveToken(token);
		alert('Success login');
		
		buildDashboard();

	  } catch (err) {
		alert(err);
	  }
}

async function setupLoginLogic(event: Event): Promise<void> {
	event.preventDefault();

	const username = (document.querySelector<HTMLInputElement>('#usernameLogin')!)?.value;
	const password = (document.querySelector<HTMLInputElement>('#passwordLogin')!)?.value;
	try {
	  /* const token =  */await login({ username, password });
	//   saveToken(token);
	  alert('Success login');
	  
	  buildDashboard();

	} catch (err) {
	  alert(err);
	}	
}

function setupRegisterLogic(): void {
	// buildRegisterPage();

	const registerForm = document.querySelector<HTMLFormElement>('#register');
	if (!registerForm) return;
	const loginForm = document.querySelector<HTMLFormElement>('#login');
	if (!loginForm) return;

	loginForm.classList.add('hidden');
	registerForm.classList.remove('hidden');

	registerForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		try {
			const email = (document.querySelector<HTMLInputElement>('#emailRegister')!)?.value;
			const username = (document.querySelector<HTMLInputElement>('#usernameRegister')!)?.value;
			const password = (document.querySelector<HTMLInputElement>('#passwordRegister')!)?.value;
			await register({ email, username, password });
			alert('Success register');
			registerForm?.classList.add('hidden');
			loginForm?.classList.remove('hidden');
		} catch (err) {
			alert(err);
		  }	
	})
}