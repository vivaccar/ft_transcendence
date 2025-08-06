import { buildLoginPage } from './pages/loginPage';
import { buildRegisterPage } from './pages/registerPage';
import { setupAuthLogic } from './logic/authLogic';

export function router(): void {
  const path = window.location.pathname;
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = ''; // limpa a tela atual

  if (path === '/register') {
    buildRegisterPage();
    setupAuthLogic();
  } else if (path === '/login') {
    buildLoginPage();
    setupAuthLogic();
  } else {
    buildLoginPage(); // default
    setupAuthLogic();
  }
}
