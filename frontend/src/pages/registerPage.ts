export function buildRegisterPage(): void {
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;
  
	app.innerHTML = `
	<div id="authBox" class="min-h-screen flex items-center justify-center -mt-32">
	  <div id="register" class="whiteBox">
		<h2 class="boxTitle">Create an Account</h2>
  
		<form id="registerForm" class="space-y-4">
		  <input type="email" id="emailRegister" placeholder="E-mail" class="boxInput" />
		  <input type="text" id="usernameRegister" placeholder="Username" class="boxInput" />
		  <input type="password" id="passwordRegister" placeholder="Password" class="boxInput" />
		  <button type="submit" class="btn">
			Register
		  </button>
		</form>
	  </div>
	</div>
	`.trim();
  }