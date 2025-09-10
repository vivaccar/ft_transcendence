import "./style.css";
import { handleRoute } from "./router";
import { startPing } from "./logic/ping";
import i18next from "i18next";
import { resources } from "./locales";

async function initI18n() {
  await i18next.init({
    lng: localStorage.getItem("lang") || "en",
    debug: true,
    resources,
  });
}

async function startApp(): Promise<void> {
  await initI18n();

  handleRoute();

  window.addEventListener("popstate", () => {
    handleRoute();
  });

  startPing(10);
}

startApp();
