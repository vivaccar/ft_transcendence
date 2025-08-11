import '../../style.css';
import { renderPage } from '../../utils';
import { initializeLocalGame } from './Game';

// const playButton = document.getElementById('play-pong-btn'); //Isso aqui é apenas para teste do index.html. Index.html nao vai no commit, está só local para evitar conflitos.

export function buildHumanGameLocal(): void {
	const container = document.createElement('div');
	container.className = 'flex flex-col items-center justify-center h-screen';
	renderPage(container);

	const gameContainer = document.createElement('div');
	gameContainer.id = 'game-container';
	container.appendChild(gameContainer);
	
	if (/* playButton && */ gameContainer) {
		/* playButton.addEventListener('click', () => {
			playButton.style.display = 'none'; */
			initializeLocalGame('game-container', 600, 400);
		// });
	}
}

