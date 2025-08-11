import '../../style.css';
import { initializeLocalGame } from './Game';

const playButton = document.getElementById('play-pong-btn'); //Isso aqui é apenas para teste do index.html. Index.html nao vai no commit, está só local para evitar conflitos.
const gameContainer = document.getElementById('game-container');

if (playButton && gameContainer) {
	playButton.addEventListener('click', () => {
		playButton.style.display = 'none';
		initializeLocalGame('game-container', 600, 400);
	});
}
