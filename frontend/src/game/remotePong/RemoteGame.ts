import { navigate } from "../../router";
import { sendMessage } from "../../socketService";
import { createRemoteGameUI } from "../../components/remoteGameUi";
import type { GameState } from "../../types";

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;

//Rendering
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let animationFrameId: number | null = null;

const gameState: GameState = {
    ball: { x: 0, y: 0 },
    p1: { id: '', x: 0, y: 0, color: 'white' },
    p2: { id: '', x: 0, y: 0, color: 'white' },
    scores: { p1: 0, p2: 0 }
};

function draw() {
    if (!context) 
        return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 4;
    context.setLineDash([10, 10]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = gameState.p1.color;
    context.fillRect(gameState.p1.x, gameState.p1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    context.fillStyle = gameState.p2.color;
    context.fillRect(gameState.p2.x, gameState.p2.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(gameState.ball.x, gameState.ball.y, BALL_SIZE, 0, Math.PI * 2);
    context.fill();
    const p1ScoreEl = document.getElementById('game-player1-score');
    const p2ScoreEl = document.getElementById('game-player2-score');
    if (p1ScoreEl) p1ScoreEl.textContent = gameState.scores.p1.toString();
    if (p2ScoreEl) p2ScoreEl.textContent = gameState.scores.p2.toString();
}

function gameLoop() {
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

const handleKeyDown = (e: KeyboardEvent) => {
    const validKeys = ['w', 's', 'ArrowUp', 'ArrowDown'];
    if (validKeys.includes(e.key)) {
        e.preventDefault();
        sendMessage({ type: 'playerMove', payload: { key: e.key, keyState: 'keydown' } });
    }
};

const handleKeyUp = (e: KeyboardEvent) => {
    const validKeys = ['w', 's', 'ArrowUp', 'ArrowDown'];
    if (validKeys.includes(e.key)) {
        e.preventDefault();
        sendMessage({ type: 'playerMove', payload: { key: e.key, keyState: 'keyup' } });
    }
};

export function initGame(container: HTMLElement) {

    //ISSO AQUI TEM DE SER UM TRY CATCH
    const settingsStr = sessionStorage.getItem('gameSettings');

    if (!settingsStr) {
        console.error("DEU ERRO InitGame SettingStr");
        navigate('./games');
        return;
    }

    const settings = JSON.parse(settingsStr);
    const gameUI = createRemoteGameUI();
    const scoreboard = gameUI.querySelector('.text-6xl');

    gameUI.className = 'flex flex-col items-center justify-center gap-4';
    container.appendChild(gameUI);
    canvas = gameUI.querySelector('#game-canvas') as HTMLCanvasElement;

    //ISSO TAMBEM TEM DE SER UM TRY CATCH
    if (!canvas || !scoreboard) {
        console.error("Error! initGame - No Canvas or Scoreboard");
        return;
    }

    //ISSO PODE SER UM COMPONENT??? TALVEZ SIM
    const p1AliasSpan = document.createElement('span');
    p1AliasSpan.className = 'text-4xl text-white font-orbitron px-4';
    p1AliasSpan.textContent = settings.p1_alias || 'Player 1';

    const p2AliasSpan = document.createElement('span');
    p2AliasSpan.className = 'text-4xl text-white font-orbitron px-4';
    p2AliasSpan.textContent = settings.p2_alias || 'Player 2';

    scoreboard.prepend(p1AliasSpan);
    scoreboard.append(p2AliasSpan);

    context = canvas.getContext('2d')!;
    canvas.width = 600;
    canvas.height = 400;

    if (settings.background) {
        canvas.style.backgroundImage = `url(${settings.background})`;
        canvas.style.backgroundSize = 'cover';
        canvas.style.backgroundPosition = 'center';
    }
}

export function startGame() {
    if (animationFrameId) return;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoop();
}

export function stopGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    console.log('Loop de renderização e listeners parados.');
}

export function updateGameState(newState: any) {
    if (!newState || !newState.ball || !newState.paddles || !newState.scores) {
        //DEBUG - NAO EXCLUIR AINDA
        console.error("Recebido estado de jogo inválido:", newState);
        return;
    }
    gameState.ball = newState.ball;
    gameState.p1 = newState.paddles[0];
    gameState.p2 = newState.paddles[1];
    gameState.scores = newState.scores;
}

export function showGameOver(winnerName: string) {
    stopGame();

    const gameOverScreen = document.getElementById('game-over-screen');
    const winnerText = document.getElementById('winner-text');
    const playAgainButton = document.getElementById('play-again-button') as HTMLButtonElement | null;
    const homeButton = document.getElementById('home-button') as HTMLButtonElement | null;

    if (gameOverScreen && winnerText && playAgainButton && homeButton) {
        winnerText.textContent = `${winnerName} Venceu!`;
        playAgainButton.onclick = () => navigate('/human-game-remote');
        homeButton.onclick = () => navigate('/dashboard');
        gameOverScreen.classList.remove('hidden');
    }
}

