import '../../style.css';
import { renderPage } from '../../utils';
import { initializeLocalGame } from './Game';

// const playButton = document.getElementById('play-pong-btn'); //Isso aqui é apenas para teste do index.html. Index.html nao vai no commit, está só local para evitar conflitos.

export function buildHumanGameLocal(): void {
	const container = document.createElement('div');
	container.className = 'flex items-center justify-center h-screen gap-[5rem]';
	renderPage(container);

	const player1Title = document.createElement("h2");
  	player1Title.textContent = "Player 1";
  	player1Title.className = "text-white font-orbitron font-bold mb-2";
  	container.appendChild(player1Title);

	const gameContainer = document.createElement('div');
	gameContainer.id = 'game-container';
	container.appendChild(gameContainer);

	const player2Title = document.createElement("h2");
  	player2Title.textContent = "Player 2";
  	player2Title.className = "text-white font-orbitron font-bold mb-2";
  	container.appendChild(player2Title);
	
	if (gameContainer) {
		initializeLocalGame('game-container', 600, 400);
	}
}

