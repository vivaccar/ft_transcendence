export function buildRegisterPage(): void {
	const authBox = document.querySelector<HTMLDivElement>('#authBox');
	if (!authBox) return;

	const loginForm = document.querySelector<HTMLDivElement>('#login');
	loginForm?.classList.add('hidden');

	authBox.innerHTML = `
	<div id="register" class="whiteBox">
		<h2 class="boxTitle">Create an Account</h2>

		<form id="registerForm" class="space-y-4">
			<input type="email" id="email" placeholder="E-mail" class="boxInput" />

			<input type="text" id="username" placeholder="Username" class="boxInput" />
		
			<input type="password" id="password" placeholder="Password" class="boxInput" />
		
			<button type="submit" class="btn">
			Register
			</button>
		</form>
	</div>
	`
}