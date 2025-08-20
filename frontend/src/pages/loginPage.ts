export function buildLoginPage(): void {
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;
	
	app.innerHTML = `
	<h1 id="pongTitle" class="font-orbitron font-semibold text-gray-50 text-6xl mt-64 text-center" > | PONG GAME | </h1>
	<div id="authBox" class="min-h-screen flex items-center justify-center -mt-32">
		<div id="login" class="whiteBox">
			<h2 class="boxTitle">Welcome Back</h2>
	
			<form id="loginForm" class="space-y-4">
		  
				<button id="googleBtn" type="submit" class="btn border border-gray-300 shadow-md px-4 py-2 rounded !bg-gray-50 !text-gray-800 flex items-center justify-center gap-2 w-full">
  					<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" class="w-5 h-5" />
  					Continue with Google
				</button>

				<div class="flex items-center my-6">
  					<div class="flex-grow h-px bg-gray-300"></div>
  					<span class="px-4 text-sm text-gray-500">or</span>
  					<div class="flex-grow h-px bg-gray-300"></div>
				</div>

				<input type="text" id="usernameLogin" placeholder="Username" class="boxInput" />
		  
		  		<input type="password" id="passwordLogin" placeholder="Password" class="boxInput" />

				<button type="submit" class="btn">
		  			Login
		  		</button>

		  	</form>
  
		  	<p id="message" class="mt-4 text-center text-sm text-red-600 hidden"></p>
		  
		  	<p class="mt-4 text-center text-sm text-gray-600">
		  		Don't have an account?

		  		<a href="/register" id="go-to-register" class="text-blue-600 hover:underline">
    				Register
 				</a>
				
		  	</p>
	</div>
	`;
}
