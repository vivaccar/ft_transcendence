import { renderPage } from "../utils";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";

export function buildAIGame(){
	const container = document.createElement('div');
	container.className = 'flex flex-col items-center justify-center h-screen';
	renderPage(container);

	const title = document.createElement('h1');
	title.textContent = 'Man vs AI';
	title.className = 'text-white font-orbitron font-bold text-4xl mb-8';
	container.appendChild(title);

	const onSelectBackground = (bgId: string) => {
		console.log("Background selecionado:", bgId);
	};

	const carousel = BackgroundCarousel(onSelectBackground);
	container.appendChild(carousel);

	const onSelectColor = (bgId: string) => {
		console.log("Color selecionado:", bgId);
	};

	const colorSelector = ColorSelector(onSelectColor);
	container.appendChild(colorSelector);
}