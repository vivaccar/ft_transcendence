import "./style.css";
import { handleRoute } from "./router";

function startApp(): void {
  // const app = document.getElementById('app');
  // if (!app) throw new Error('Any #app element.');

  // if (isAuthenticated()) {
  //   alert('Already login');
  // } else {
  // buildLoginPage();
  // setupAuthLogic();
  // }
  // buildDashboard();

  handleRoute();

  window.addEventListener("popstate", () => {
    handleRoute();
  });
}

startApp();
