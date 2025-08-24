import '../../style.css';
import { renderPage } from '../../utils';
import { initializeLocalGame } from './Game';
import { initializeTournamentMatch } from './Tournament';

export function buildHumanGameLocal(gameType: string): void {
    const container = document.createElement('div');
    container.className = 'flex items-center justify-center h-screen gap-[5rem]';
    renderPage(container);

    let player1Name = sessionStorage.getItem('playerName1');
    if (gameType != 'tournament')
        player1Name = 'Player 1';
    const player1Title = document.createElement("h2");
    player1Title.textContent = player1Name;
    player1Title.className = "text-white font-orbitron font-bold text-2xl w-48 text-center";
    container.appendChild(player1Title);

    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    container.appendChild(gameContainer);

    let player2Name = sessionStorage.getItem('playerName2');
    if (gameType == 'ai')
        player2Name = 'AI';
    else if (gameType == 'human')
        player2Name = 'Guest';
    else if (player2Name === null)
        player2Name = 'Player 2';
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

