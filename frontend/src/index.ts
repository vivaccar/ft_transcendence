import "./style.css";
import { handleRoute } from "./router";

async function pingBackend(): Promise<void> {
  try {
    const res = await fetch('/api/ping', {
      method: 'POST',
    });
    if (res.status === 401) return;

  } catch (err) {}
}

function startPing(intervalSeconds: number): void {
  pingBackend(); // ping
  setInterval(pingBackend, intervalSeconds * 1000);
}


function startApp(): void {

  handleRoute();

  window.addEventListener("popstate", () => {
    handleRoute();
  });

  startPing(20);
}

startApp();
