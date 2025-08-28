import { API_ROUTES } from '../config';

export async function pingBackend(): Promise<void> {
  try {
    const res = await fetch(API_ROUTES.ping, {
      method: 'POST',
    });
    if (res.status === 401) return;

  } catch (err) {}
}

export function startPing(intervalSeconds: number): void {
  pingBackend();
  setInterval(pingBackend, intervalSeconds * 1000);
}