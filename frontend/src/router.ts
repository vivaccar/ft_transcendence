import { buildLoginPage } from "./pages/loginPage";
import { buildRegisterPage } from "./pages/registerPage";
import { setupAuthLogic, setupRegisterLogic } from "./logic/authLogic";
import { buildDashboard } from "./pages/dashboardPage";
import { buildGamePageManVsManLocal } from "./pages/PageHumanVsHumanLocal";
import { buildHumanGameLocal } from "./game/localPong/Pong";
import { buildSettingsPage } from "./pages/settingsPage";
import { buildStatisticsPage } from "./pages/statisticPage";
import { buildFriendsPage } from "./pages/friendsPage";
import { buildRemoteGamePage } from "./pages/remoteGamePage";
import { buildNotFoundPage } from "./pages/notFoundPage";
import { protectedRoute } from "./logic/authLogic";
// import { setupSettingsLogic } from "./logic/settingsLogic";
import { buildTournamentsPage } from "./pages/tournamentPage";

const routes: Record<string, () => void | Promise<void>> = {
  "/": protectedRoute(() => {
    buildDashboard();
  }),
  "/login": () => {
    buildLoginPage();
    setupAuthLogic();
  },
  "/register": () => {
    buildRegisterPage();
    setupRegisterLogic();
  },
  "/dashboard": protectedRoute(() => {
    buildDashboard();
  }),
  "/games": protectedRoute(() => {
    buildDashboard();
  }),
  "/ai-game": protectedRoute(() => {
    buildGamePageManVsManLocal("human");
  }),
  "/human-game-local": protectedRoute(() => {
    buildGamePageManVsManLocal("human");
  }),
  "/human-game-remote": protectedRoute(() => {
    buildRemoteGamePage();
  }),
  "/game-local": protectedRoute(() => {
    buildHumanGameLocal("human");
  }),
  "/settings": protectedRoute(() => {
    buildSettingsPage();
  }),
  "/statistics": protectedRoute(() => {
    buildStatisticsPage();
  }),
  "/friends": protectedRoute(() => {
    buildFriendsPage();
  }),
  "/tournament": protectedRoute(() => {
    buildTournamentsPage("tournament");
  }),
};

export function handleRoute(): void {
  const path = window.location.pathname;
  const routeHandler = routes[path];

  if (routeHandler) {
    routeHandler();
  } else {
    buildNotFoundPage();
  }
}

export function navigate(path: string): void {
  history.pushState(null, "", path);
  handleRoute();
}
