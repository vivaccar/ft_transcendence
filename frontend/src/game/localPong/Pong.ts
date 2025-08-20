import '../../style.css';
import { renderPage } from '../../utils';
import { initializeLocalGame } from './Game';
import { initializeTournamentMatch } from './Tournament';

export function buildHumanGameLocal(gameType: string): void {
    const container = document.createElement('div');
    container.className = 'flex items-center justify-center h-screen gap-[5rem]';
    renderPage(container);

    const player1Name = sessionStorage.getItem('playerName1') || 'Player 1';
    const player1Title = document.createElement("h2");
    player1Title.textContent = player1Name;
    player1Title.className = "text-white font-orbitron font-bold text-2xl w-48 text-center";
    container.appendChild(player1Title);

    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    container.appendChild(gameContainer);

    const player2Name = sessionStorage.getItem('playerName2') || 'Player 2';
    const player2Title = document.createElement("h2");
    player2Title.textContent = player2Name;
    player2Title.className = "text-white font-orbitron font-bold text-2xl w-48 text-center";
    container.appendChild(player2Title);

    if (gameType === "tournament") {
        initializeTournamentMatch('game-container', 600, 400, gameType);
    } else {
        initializeLocalGame('game-container', 600, 400, gameType);
    }
}

