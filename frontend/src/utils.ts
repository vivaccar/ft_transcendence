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
