import './style.css'
// import { isAuthenticated } from './auth/authService';
import { buildLoginPage } from './pages/loginPage';
import { setupAuthLogic } from './logic/authLogic';
// import { buildDashboard } from './pages/dashboardPage';

function startApp(): void {
  const app = document.getElementById('app');
  if (!app) throw new Error('Any #app element.');

  // if (isAuthenticated()) {
  //   alert('Already login');
  // } else {
    buildLoginPage();
    setupAuthLogic();
  // }
  // buildDashboard();
}

startApp();