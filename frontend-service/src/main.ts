import './style.css'
import { authenticateUser } from './login'
import { buildLoginPage } from './login'

buildLoginPage();

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', authenticateUser);
}
