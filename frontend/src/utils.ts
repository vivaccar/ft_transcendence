import { Navbar } from "./components/Navbar";

export function renderPage(content: HTMLElement) {
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;

	app.classList.remove('justify-center');
	app.classList.add('justify-start');
	app.classList.add('m-0', 'p-0', 'w-full');
	app.innerHTML = '';

	app.appendChild(Navbar());
	app.appendChild(content);
}

export function getCookieValue(name: string): string | null {
	const cookies = document.cookie.split(";").map(c => c.trim());
	for (const cookie of cookies) {
	  const [key, value] = cookie.split("=");
	  if (key === name) return decodeURIComponent(value);
	}
	return null;
  }