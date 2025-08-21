import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { createGameUI } from '../../components/localGameUi';

// --- TIPOS E ESTADO GLOBAL DO MÓDULO ---
type GameArea = {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    state: 'playing' | 'paused' | 'ended';
    start: () => void;
    stop: () => void;
    clear: () => void;
};
//INTERFACE - PRECISO REFATORAR PARA UM ARQUIVO ESPECIFICO
interface GameSettings {
  containerId: string;
  width: number;
  height: number;
  mode: string;
}


let lastGameSettings: GameSettings | null = null;
let player1: Paddle;
let player2: Paddle;
let ball: Ball;
let keysPressed: { [key: string]: boolean } = {};
let animationFrameId: number | null = null;
let currentGameMode: string;
let lastTime = 0;
let aiDecisionTimer = 1;
let aiTargetY = 0;
let winningScore = 2;
const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = true; };
const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = false; };


function makeAIDecision() {
    const distanceX = player2.x - ball.x;
    if (ball.speedX < 0) {
        aiTargetY = myGameArea.canvas!.height / 2;
        return;
    }

    const timeToImpact = distanceX / ball.speedX;
    let predictedY = ball.y + ball.speedY * timeToImpact;
    const canvasHeight = myGameArea.canvas!.height;

    // Simula ressaltos.
    while (predictedY < 0 || predictedY > canvasHeight) {
        if (predictedY < 0) {
            predictedY = -predictedY;
        }
        if (predictedY > canvasHeight) {
            predictedY = canvasHeight - (predictedY - canvasHeight);
        }
    }

    // Margem de erro, pra IA ficar imperfeita.
    const errorMargin = (Math.random() - 0.5) * player2.height * 2;
    aiTargetY = predictedY + errorMargin;
}

function executeAIMove() {
    const paddleCenter = player2.y + player2.height / 2;
    const tolerance = 8; 

    if (paddleCenter < aiTargetY - tolerance) {
        keysPressed['arrowup'] = false;
        keysPressed['arrowdown'] = true;
    } 
    else if (paddleCenter > aiTargetY + tolerance) {
        keysPressed['arrowdown'] = false;
        keysPressed['arrowup'] = true;
    }
    else {
        keysPressed['arrowup'] = false;
        keysPressed['arrowdown'] = false;
    }
}

// --- O OBJETO SINGLETON GERENCIADOR ---
const myGameArea: GameArea = {
    canvas: null,
    context: null,
    state: 'paused',

    start() {
        if (!this.canvas || !this.context) {
            console.log("Error! No Canvas or No Context.");
            return;
        }
        this.state = 'playing';
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updateGameArea);
    },

    clear() {
        if (this.context && this.canvas) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    stop() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        this.state = 'ended';
    },
};

function updateGameArea(currentTime: number) {
    if (myGameArea.state !== 'playing') 
        return;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (currentGameMode === 'ai') {
        aiDecisionTimer -= deltaTime;

        if (aiDecisionTimer <= 0) {
            makeAIDecision();
            aiDecisionTimer = 1.0;
        }
        executeAIMove();
    }
    handleInput(deltaTime);
    ball.update(deltaTime);
    checkCollisions();
    checkScore();
    myGameArea.clear();
    draw();
    animationFrameId = requestAnimationFrame(updateGameArea);
}

function draw() {
    const ctx = myGameArea.context!;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(myGameArea.canvas!.width / 2, 0);
    ctx.lineTo(myGameArea.canvas!.width / 2, myGameArea.canvas!.height);
    ctx.stroke();
    ctx.setLineDash([]);
    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);
}

function handleInput(deltaTime: number) {

    const effectivePaddleSpeed = player1.speed;

    if (keysPressed['w'] && player1.y > 0) { 
        player1.y -= effectivePaddleSpeed * deltaTime; 
    }
    if (keysPressed['s'] && player1.y < myGameArea.canvas!.height - player1.height) { 
        player1.y += effectivePaddleSpeed * deltaTime; 
    }
    if (keysPressed['arrowup'] && player2.y > 0) { 
        player2.y -= effectivePaddleSpeed * deltaTime; 
    }
    if (keysPressed['arrowdown'] && player2.y < myGameArea.canvas!.height - player2.height) { 
        player2.y += effectivePaddleSpeed * deltaTime; 
    }
}

function checkCollisions() {
    
    if (ball.speedX < 0 && 
        ball.x - ball.size < player1.x + player1.width && 
        ball.x + ball.size > player1.x && 
        ball.y + ball.size > player1.y && 
        ball.y - ball.size < player1.y + player1.height) 
    {
        ball.x = player1.x + player1.width + ball.size; //reposiciona para evitar que a bola entre na raquete
        ball.speedX *= -1;
    }

    if (ball.speedX > 0 && 
        ball.x + ball.size > player2.x && 
        ball.x - ball.size < player2.x + player2.width && 
        ball.y + ball.size > player2.y && 
        ball.y - ball.size < player2.y + player2.height) 
    {
        
        ball.x = player2.x - ball.size;
        ball.speedX *= -1;
    }
}

function checkScore() {
    let winnerName: string | null = null;

    //AQUI, TEM DE VIR A VARIAVEL COM O NOME DO PLAYER
    if (ball.x - ball.size < 0) {
        player2.score++;
        updateScoreboard();
        if (player2.score >= winningScore) {
            winnerName = 'Player 2';
        } else {
            ball.reset();
        }
    //AQUI, TEM DE VIR A VARIAVEL COM O NOME DO PLAYER
    } else if (ball.x + ball.size > myGameArea.canvas!.width) {
        player1.score++;
        updateScoreboard();
        if (player1.score >= winningScore) {
            winnerName = 'Player 1';
        } else {
            ball.reset();
        }
    }

    // Se a variável winnerName tiver um valor, o jogo acaba.
    if (winnerName) {
        endGame(winnerName);
    }
}

function endGame(winnerName: string) {
    myGameArea.stop();

    // 2. Encontra os elementos HTML que vamos manipular
    //AQUI SAO COMPONENTES E PRECISO REFATORAR PARA FICAREM SEPARADOS NOS COMPONENTES
    const gameOverScreen = document.getElementById('game-over-screen');
    const winnerText = document.getElementById('winner-text');

    if (gameOverScreen && winnerText) {
        winnerText.textContent = `${winnerName} won!`;
        
        // Remove a classe "hidden" para mostrar o overlay
        gameOverScreen.classList.remove('hidden');
    }
}

function updateScoreboard() {
    const p1ScoreElement = document.getElementById('game-player1-score');
    const p2ScoreElement = document.getElementById('game-player2-score');
    if (p1ScoreElement) p1ScoreElement.textContent = player1.score.toString();
    if (p2ScoreElement) p2ScoreElement.textContent = player2.score.toString();
}

function setupRestartButton(): void {
    const restartButton = document.getElementById('restart-button') as HTMLButtonElement | null;

    // Type Guard: o código só corre se o botão existir no DOM.
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    } else {
        console.warn('Botão de reiniciar não encontrado. A funcionalidade de reinício não estará disponível.');
    }
}

function restartGame(): void {
    // Type Guard: o código só corre se as configurações tiverem sido guardadas.
    if (lastGameSettings) {
        // A função de inicialização já chama cleanupGame(), por isso não precisamos de o fazer aqui.
        initializeLocalGame(
            lastGameSettings.containerId,
            lastGameSettings.width,
            lastGameSettings.height,
            lastGameSettings.mode,
        );
    } else {
        console.error('Não foi possível reiniciar o jogo: as configurações iniciais não foram encontradas.');
    }
}

function cleanupGame(): void {
    console.log("A limpar a instância anterior do jogo...");
    
    // Para o loop de animação, se estiver a correr
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Remove os listeners de eventos da janela para evitar duplicados
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
}

export function initializeLocalGame(containerId: string, width: number, height: number, mode: string) {
    cleanupGame();

    currentGameMode = mode;
    const container = document.getElementById(containerId);
    lastGameSettings = { containerId, width, height, mode };

    if (!container) {
        console.error(`ERRO: Contentor com id "${containerId}" não encontrado.`);
        return;
    }
    const savedBackground = sessionStorage.getItem('selectedBackground');

    container.innerHTML = '';
    const gameUI = createGameUI();
    container.appendChild(gameUI);

    myGameArea.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!myGameArea.canvas) {
        console.error('ERRO: Não foi possível encontrar o elemento #game-canvas.');
        return;
    }

    myGameArea.context = myGameArea.canvas.getContext('2d');
    myGameArea.canvas.width = width;
    myGameArea.canvas.height = height;

    if (savedBackground) {
        myGameArea.canvas.style.backgroundImage = `url(${savedBackground})`;
        console.log(myGameArea.canvas.style.backgroundImage);
        myGameArea.canvas.style.backgroundSize = 'cover';
        myGameArea.canvas.style.backgroundPosition = 'center';
    } else {
        myGameArea.canvas.style.backgroundColor = 'black'; // fallback
    }

    const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 300;
    const ballSize = 10, ballSpeed = 300;
    player1 = new Paddle(paddleWidth, myGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP1') || 'white');
    player2 = new Paddle(myGameArea.canvas.width - paddleWidth * 2, myGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP2') || 'white');
    ball = new Ball(myGameArea.canvas.width / 2, myGameArea.canvas.height / 2, ballSize, ballSpeed, myGameArea.canvas);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp); 

    //ESSE BOTAO TEM DE DAR A OPÇÃO DE VOLTAR PARA TELAS ESPECIFICATA TAMBEM DE ACORDO COM O DESENHO
    setupRestartButton();

    myGameArea.start();
}