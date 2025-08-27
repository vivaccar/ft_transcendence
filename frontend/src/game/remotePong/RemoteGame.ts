//frontend/src/game/remotePong/RemoteGame.ts
import { navigate } from "../../router";
import { createGameUI } from "../../components/localGameUi";
import { sendMessage } from "../../socketService";

// --- TIPAGEM PARA O ESTADO DO JOGO ---
interface PaddleState {
    id: string;
    x: number;
    y: number;
}

interface GameState {
    ball: { x: number; y: number; };
    p1: PaddleState;
    p2: PaddleState;
    scores: { p1: number; p2: number; };
}

// --- CONSTANTES DO JOGO ---
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;

// --- ESTADO LOCAL DO JOGO (controlado pelo servidor) ---
const gameState: GameState = {
    ball: { x: 0, y: 0 },
    p1: { id: '', x: 0, y: 0 },
    p2: { id: '', x: 0, y: 0 },
    scores: { p1: 0, p2: 0 }
};

// --- VARIÁVEIS DE RENDERIZAÇÃO ---
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let animationFrameId: number | null = null;
let paddleColor1 = 'white';
let paddleColor2 = 'white';


// --- LÓGICA DE RENDERIZAÇÃO E INPUT ---

/**
 * Desenha o estado atual do jogo no canvas.
 */
function draw() {
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Linha do meio
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 4;
    context.setLineDash([10, 10]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.setLineDash([]);
    
    // Paddles (com cores personalizadas e posições do servidor)
    context.fillStyle = paddleColor1;
    context.fillRect(gameState.p1.x, gameState.p1.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    context.fillStyle = paddleColor2;
    context.fillRect(gameState.p2.x, gameState.p2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Bola
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(gameState.ball.x, gameState.ball.y, BALL_SIZE, 0, Math.PI * 2);
    context.fill();

    // Placar
    const p1ScoreEl = document.getElementById('game-player1-score');
    const p2ScoreEl = document.getElementById('game-player2-score');
    if (p1ScoreEl) p1ScoreEl.textContent = gameState.scores.p1.toString();
    if (p2ScoreEl) p2ScoreEl.textContent = gameState.scores.p2.toString();
}

/**
 * O loop de animação que desenha o jogo continuamente.
 */
function gameLoop() {
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Captura o pressionar de teclas e envia para o servidor.
 */
const handleKeyDown = (e: KeyboardEvent) => {
    const validKeys = ['w', 's', 'ArrowUp', 'ArrowDown'];
    if (validKeys.includes(e.key)) {
        e.preventDefault();
        sendMessage({ type: 'playerMove', payload: { key: e.key, keyState: 'keydown' } });
    }
};

/**
 * Captura o soltar de teclas e envia para o servidor.
 */
const handleKeyUp = (e: KeyboardEvent) => {
    const validKeys = ['w', 's', 'ArrowUp', 'ArrowDown'];
    if (validKeys.includes(e.key)) {
        e.preventDefault();
        sendMessage({ type: 'playerMove', payload: { key: e.key, keyState: 'keyup' } });
    }
};


// --- FUNÇÕES PÚBLICAS EXPORTADAS ---

/**
 * Inicializa a UI do jogo, aplicando estilos e configurações.
 * @param container O elemento HTML onde o jogo será renderizado.
 */
export function initGame(container: HTMLElement) {
    const settingsStr = sessionStorage.getItem('gameSettings');
    if (!settingsStr) {
        console.error("Definições do jogo não encontradas! A redirecionar...");
        navigate('./games'); 
        return;
    }
    const settings = JSON.parse(settingsStr);

    // 1. Usa a tua função para construir a estrutura HTML base
    const gameUI = createGameUI();

    // 2. Anexa a UI inteira de uma só vez ao container da página
    container.appendChild(gameUI);
    
    // 3. Procura os elementos DENTRO da UI que acabámos de adicionar
    const scoreboard = gameUI.querySelector('.text-6xl');
    canvas = gameUI.querySelector('#game-canvas') as HTMLCanvasElement;
    const restartButton = gameUI.querySelector('#restart-button') as HTMLButtonElement;

    if (!canvas || !scoreboard || !restartButton) {
        console.error("Erro crítico: Um ou mais elementos da UI do jogo não foram encontrados.");
        return;
    }
    
    // 4. Configura o placar com os nomes dos jogadores
    const p1AliasSpan = document.createElement('span');
    p1AliasSpan.className = 'text-4xl text-white font-orbitron px-4';
    p1AliasSpan.textContent = settings.p1_alias || 'Player 1';

    const p2AliasSpan = document.createElement('span');
    p2AliasSpan.className = 'text-4xl text-white font-orbitron px-4';
    p2AliasSpan.textContent = settings.p2_alias || 'Player 2';
    
    scoreboard.prepend(p1AliasSpan);
    scoreboard.append(p2AliasSpan);

    // 5. Configura o canvas
    context = canvas.getContext('2d')!;
    canvas.width = 600;
    canvas.height = 400;

    const background = sessionStorage.getItem('selectedBackground');
    if (background) {
        canvas.style.backgroundImage = `url(${background})`;
        canvas.style.backgroundSize = 'cover';
        canvas.style.backgroundPosition = 'center';
    }
    
    // 6. Guarda as cores dos paddles
    paddleColor1 = settings.p1_color;
    paddleColor2 = settings.p2_color;

    // 7. Configura o botão do ecrã de "Game Over"
    restartButton.onclick = () => navigate('./games'); 
}

/**
 * Inicia o loop de renderização e os listeners de teclado.
 */
export function startGame() {
    if (animationFrameId) return; // Previne múltiplos loops
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoop();
}

/**
 * Para o loop de renderização e remove os listeners de teclado.
 */
export function stopGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    console.log('Loop de renderização e listeners parados.');
}

/**
 * Atualiza o estado local do jogo com os dados recebidos do servidor.
 */
export function updateGameState(newState: any) {
    gameState.ball = newState.ball;
    gameState.p1 = newState.paddles[0];
    gameState.p2 = newState.paddles[1];
    gameState.scores = newState.scores;
}

/**
 * Mostra o ecrã de "Game Over" com o nome do vencedor.
 */
export function showGameOver(winnerName: string) {
    stopGame(); // Garante que o jogo e os inputs param
    
    const gameOverScreen = document.getElementById('game-over-screen');
    const winnerText = document.getElementById('winner-text');

    if (gameOverScreen && winnerText) {
        winnerText.textContent = `${winnerName} Venceu!`;
        gameOverScreen.classList.remove('hidden');
    }
}