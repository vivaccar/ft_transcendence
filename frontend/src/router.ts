import { buildLoginPage } from "./pages/loginPage";
import { buildRegisterPage } from "./pages/registerPage";
import { setupAuthLogic, setupRegisterLogic } from "./logic/authLogic";
import { buildDashboard } from "./pages/dashboardPage";
import { buildGamePageManVsManLocal } from "./pages/PageHumanVsHumanLocal";
import { buildHumanGameLocal } from "./game/localPong/Pong";
import { buildSettingsPage } from "./pages/settingsPage";
import { buildStatisticsPage } from "./pages/statisticPage";
// import { setupSettingsLogic } from "./logic/settingsLogic";

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
  "/games": () => {
    buildDashboard();
  },
  "/ai-game": () => {
  },
  "/human-game-local": () => {
    buildGamePageManVsManLocal();
  },
  "/game-local": () => {
    buildHumanGameLocal();
  },
  "/settings": () => {
    buildSettingsPage();
  },
  "/statistics": () => {
    buildStatisticsPage();
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
