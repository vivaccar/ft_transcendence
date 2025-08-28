import "./style.css";
import { handleRoute } from "./router";
import { startPing } from "./logic/ping";


function startApp(): void {

  handleRoute();

  window.addEventListener("popstate", () => {
    handleRoute();
  });

  startPing(20);
}

startApp();
