import './style.css'
/* import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg' */
// import { setupCounter } from './counter.ts'
import { createLoginForm } from './login'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="first-page" class="max-w-sm mx-auto p-10 bg-white bg-opacity-5 rounded-lg shadow-md backdrop-blur-md flex flex-col itens-center justify-center">
    <button id="login-btn" class="btn">
      Login
    </button>
    <p class="text-gray-50 text-center p-3 font-silkscreen">or</p>
    <button id="register-btn" class="btn">
      Register
    </button>
  </div>
`;
// change to first page

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', createLoginForm);
}
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// const app = document.querySelector<HTMLDivElement>('#app')!;
// app.innerHTML = '';  // limpa conteúdo
// app.appendChild(createLoginForm());