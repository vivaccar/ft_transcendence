import { buildLoginPage } from "./pages/loginPage";
import { buildRegisterPage } from "./pages/registerPage";
import { setupAuthLogic, setupRegisterLogic } from "./logic/authLogic";
import { buildDashboard } from "./pages/dashboardPage";

const routes: Record<string, () => void> = {
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
};

export function handleRoute(): void {
  const path = window.location.pathname;
  const routeHandler = routes[path];

  if (routeHandler) {
    routeHandler();
  } else {
    // Rota não encontrada → redireciona para /login, posteriormente, pagina de erro
    history.replaceState(null, "", "/login");
    routes["/login"]();
  }
}

export function navigate(path: string): void {
  history.pushState(null, "", path);
  handleRoute();
}
