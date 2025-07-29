import './style.css'
/* import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg' */
// import { setupCounter } from './counter.ts'
import { createLoginForm } from './login'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="flex flex-col items-center justify-start h-full pt-60 space-y-4">
    <button id="login-btn" class="btn">
      Login
    </button>
    <p class="text-gray-50 font-silkscreen">or</p>
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