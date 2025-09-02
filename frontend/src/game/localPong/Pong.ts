import '../../style.css';
import { renderPage } from '../../utils';
import { initializeLocalGame } from './Game';
import { initializeTournamentMatch } from './Tournament';
import { API_ROUTES } from '../../config';

async function loadUserProfile() {

    try {
      const res = await fetch(`${API_ROUTES.me}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();

      return data
    } catch (err) {
      alert('Error loading profile: ' + err);
    }
}

export async function buildHumanGameLocal(gameType: string, gameMode: string): Promise<void> {
    const container = document.createElement('div');
    container.className = 'flex items-center justify-center h-screen gap-[5rem]';
    renderPage(container);

    const logedUserData = await loadUserProfile();

    let player1Name = sessionStorage.getItem('playerName1') ?? "Player 1";
    if (gameType !== 'tournament') {
      player1Name = logedUserData.username ?? "Player 1";
    }
    
    const player1Title = document.createElement("h2");
    player1Title.textContent = player1Name;
    player1Title.className = `text-white font-orbitron font-bold text-2xl w-48 text-center truncate`;
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
    player2Title.className = `text-white font-orbitron font-bold text-2xl max-w-full text-center truncate`;
    container.appendChild(player2Title);

    if (gameType === "tournament") {
        initializeTournamentMatch('game-container', 600, 400, gameType);
    } else {
        initializeLocalGame('game-container', 600, 400, gameType, player1Name, player2Name, gameMode);
    }
}

