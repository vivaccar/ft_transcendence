import "./style.css";
import { handleRoute } from "./router";

//import { buildDashboard } from "./pages/dashboardPage";

function startApp(): void {

  // buildDashboard();

  handleRoute();

  window.addEventListener("popstate", () => {
    handleRoute();
  });
}

startApp();
