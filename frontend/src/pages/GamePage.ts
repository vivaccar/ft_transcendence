import { renderPage } from "../utils";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";
import { ErrorMessage } from "../components/ErrorMessage";
import { navigate } from "../router";

export function buildGamePage(gameType : string){
	let selectedColor : string | null = null;
	let selectedbackgroundImg = '/images/backgroundGame/back10.jpg';

	const container = document.createElement('div');
	container.className = 'flex flex-col items-center justify-center h-screen';
	renderPage(container);

	const title = document.createElement('h1');
	title.textContent = gameType;
	title.className = 'text-white font-orbitron font-bold text-4xl mb-8';
	container.appendChild(title);

	const onSelectBackground = (Background: string) => {
		selectedbackgroundImg = Background;
	};

	const carousel = BackgroundCarousel(onSelectBackground);
	container.appendChild(carousel);

	const onSelectColor = (color: string) => {
		selectedColor = color;
	};

	const colorSelector = ColorSelector(onSelectColor);
	container.appendChild(colorSelector);

	const startBtn = document.createElement('button');
	startBtn.textContent = 'Start';
	startBtn.className = 'mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition';
	startBtn.addEventListener('click', () => {
		if (!selectedColor) {
			container.appendChild(ErrorMessage('Please, select one color!'));
		} else {

			sessionStorage.setItem('selectedColor', selectedColor);
			sessionStorage.setItem('selectedBackground', selectedbackgroundImg);
			console.log('Start game with color:', sessionStorage.getItem('selectedColor'));
			console.log('Start game with back:', sessionStorage.getItem('selectedBackground'));
			navigate('./game');
		}
	});
	container.appendChild(startBtn);
}