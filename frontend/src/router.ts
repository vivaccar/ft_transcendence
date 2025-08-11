import { buildLoginPage } from "./pages/loginPage";
import { buildRegisterPage } from "./pages/registerPage";
import { setupAuthLogic, setupRegisterLogic } from "./logic/authLogic";
import { buildDashboard } from "./pages/dashboardPage";
import { buildAIGame } from "./pages/AIGamePage";

const routes: Record<string, () => void> = {
  "/": () => {
    buildLoginPage();
    setupAuthLogic();
  },
  "/login": () => {
    buildLoginPage();
    setupAuthLogic();
  },
  "/register": () => {
    buildRegisterPage();
    setupRegisterLogic();
  },
  "/dashboard": () => {
    buildDashboard();
  },
  "/ai-game": () => {
    buildAIGame();
  },
};

export function handleRoute(): void {
  const path = window.location.pathname;
  const routeHandler = routes[path];

  if (routeHandler) {
    routeHandler();
  } else {
    // // Rota não encontrada → redireciona para /login, posteriormente, pagina de erro
    // history.replaceState(null, "", "/login");
    // routes["/login"]();
  }
}

export function navigate(path: string): void {
  history.pushState(null, "", path);
  handleRoute();
}
