export function buildRegisterPage(): void {
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;
  
	app.innerHTML = `
	<div id="authBox" class="h-screen flex flex-col gap-16 items-center justify-center">
		<h1 id="pongTitle" class="font-orbitron font-semibold text-gray-50 text-6xl text-center" > | PONG GAME | </h1>
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