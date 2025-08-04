export function buildLoginPage(): void {
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;
	
	app.innerHTML = `
	<div id="authBox" class="min-h-screen flex items-center justify-center -mt-32">
		<div id="login" class="whiteBox">
			<h2 class="boxTitle">Welcome Back</h2>
	
			<form id="loginForm" class="space-y-4">
		  		<input type="text" id="username" placeholder="Username" class="boxInput" />
		  
		  		<input type="password" id="password" placeholder="Password" class="boxInput" />
		  
		  		<button type="submit" class="btn">
		  		Login
		  		</button>
		  	</form>
  
		  	<p id="message" class="mt-4 text-center text-sm text-red-600 hidden"></p>
		  
		  	<p class="mt-4 text-center text-sm text-gray-600">
		  		Don't have an account?

		  		<button id="go-to-register" class="text-blue-600 hover:underline">
    			Register
  				</button>
				
		  	</p>
		</div>
	</div>
	`;
}