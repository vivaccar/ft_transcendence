// frontend-service/src/main.ts
import './style.css';

// Endereço do API Gateway, acessível pela máquina host
const API_GATEWAY_URL = 'http://localhost:3000';

const loginForm = document.querySelector<HTMLFormElement>('#login-form');
const usernameInput = document.querySelector<HTMLInputElement>('#username');
const passwordInput = document.querySelector<HTMLInputElement>('#password');
const responseMessage = document.querySelector<HTMLDivElement>('#response-message');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o recarregamento da página

  if (!usernameInput || !passwordInput || !responseMessage) return;

  responseMessage.textContent = 'Enviando...';
  
  try {
    const response = await fetch(`${API_GATEWAY_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }), 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Falha no login');
    }

    responseMessage.textContent = `Login bem-sucedido!`;
    responseMessage.style.color = 'green';
    console.log('Resposta do servidor:', data);

  } catch (error: any) {
    responseMessage.textContent = `Erro: ${error.message}`;
    responseMessage.style.color = 'red';
    console.error('Erro ao fazer login:', error);
  }
});