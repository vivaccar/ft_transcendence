import "./style.css";
import { handleRoute } from "./router";

function startApp(): void {

  handleRoute();

  window.addEventListener("popstate", () => {
    handleRoute();
  });
}

startApp();
