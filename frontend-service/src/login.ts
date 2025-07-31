export function buildLoginPage(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen flex items-center justify-center -mt-32">
  <div class="w-full max-w-md px-8 py-16 bg-white rounded-lg shadow-lg">
  <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6 font-sans">Welcome Back</h2>
  
  <form id="loginForm" class="space-y-4">
        <input type="text" id="username" placeholder="Username" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
        <input type="password" id="password" placeholder="Password" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
        <button id="login-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200">
        Login
        </button>
        </form>
        
        <p class="mt-4 text-center text-sm text-gray-600">
        Don't have an account? 
        <a href="#" class="text-blue-600 hover:underline">Register</a>
        </p>
        </div>
        </div>
        `;
      }

export function authenticateUser() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm){
    const username = (loginForm.querySelector<HTMLInputElement>('#username')!).value;
    const password = (loginForm.querySelector<HTMLInputElement>('#password')!).value;
    const messageEl = loginForm.querySelector<HTMLParagraphElement>('#message')!;

    console.log(username, password, messageEl);

  }
}