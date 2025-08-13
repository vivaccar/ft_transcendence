import { Ball } from './Ball';
import { Paddle } from './Paddle';

// --- TIPOS E ESTADO GLOBAL DO MÓDULO ---
type GameArea = {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    state: 'playing' | 'paused' | 'ended';
    start: () => void;
    stop: () => void;
    clear: () => void;
};

let player1: Paddle;
let player2: Paddle;
let ball: Ball;
let keysPressed: { [key: string]: boolean } = {};
let animationFrameId: number | null = null;
let currentGameMode: string;
let lastTime = 0;
let aiDecisionTimer = 1;
let aiTargetY = 0;

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
    const errorMargin = (Math.random() - 0.5) * player2.height * 1.5;
    aiTargetY = predictedY + errorMargin;
}

function executeAIMove() {
    const paddleCenter = player2.y + player2.height / 2;
    const tolerance = player2.speed; 

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
    if (currentGameMode === 'ai') {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        aiDecisionTimer -= deltaTime;

        if (aiDecisionTimer <= 0) {
            makeAIDecision();
            aiDecisionTimer = 1.0;
        }
        executeAIMove();
    }
    handleInput();
    ball.update();
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

function handleInput() {
    if (keysPressed['w'] && player1.y > 0) { 
        player1.y -= player1.speed; 
    }
    if (keysPressed['s'] && player1.y < myGameArea.canvas!.height - player1.height) { 
        player1.y += player1.speed; 
    }
    if (keysPressed['arrowup'] && player2.y > 0) { 
        player2.y -= player2.speed; 
    }
    if (keysPressed['arrowdown'] && player2.y < myGameArea.canvas!.height - player2.height) { 
        player2.y += player2.speed; 
    }
}

function checkCollisions() {
    if (ball.x - ball.size < player1.x + player1.width && ball.x - ball.size > player1.x && ball.y > player1.y && ball.y < player1.y + player1.height) {
        ball.speedX *= -1;
    }
    if (ball.x + ball.size > player2.x && ball.x + ball.size < player2.x + player2.width && ball.y > player2.y && ball.y < player2.y + player2.height) {
        ball.speedX *= -1;
    }
}

function checkScore() {
    if (ball.x - ball.size < 0) {
        player2.score++;
        ball.reset();
    } else if (ball.x + ball.size > myGameArea.canvas!.width) {
        player1.score++;
        ball.reset();
    }
    updateScoreboard();
}

function updateScoreboard() {
    const p1ScoreElement = document.getElementById('game-player1-score');
    const p2ScoreElement = document.getElementById('game-player2-score');
    if (p1ScoreElement) p1ScoreElement.textContent = player1.score.toString();
    if (p2ScoreElement) p2ScoreElement.textContent = player2.score.toString();
}

export function initializeLocalGame(containerId: string, width: number, height: number, mode: string) {
    currentGameMode = mode;
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`ERRO: Contentor com id "${containerId}" não encontrado.`);
        return;
    }
    const savedBackground = sessionStorage.getItem('selectedBackground');

    container.innerHTML = `
        <div class="text-6xl mb-4 font-mono text-center text-white">
            <span id="game-player1-score">0</span> - <span id="game-player2-score">0</span>
        </div>
        <canvas id="game-canvas" class="bg-black border-2 border-white rounded-lg"></canvas>
    `;

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

    const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 6;
    const ballSize = 10, ballSpeed = 4;
    player1 = new Paddle(paddleWidth, myGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP1') || 'white');
    player2 = new Paddle(myGameArea.canvas.width - paddleWidth * 2, myGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP2') || 'white');
    ball = new Ball(myGameArea.canvas.width / 2, myGameArea.canvas.height / 2, ballSize, ballSpeed, myGameArea.canvas);

    window.addEventListener('keydown', (e) => { keysPressed[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keysPressed[e.key.toLowerCase()] = false; });

    myGameArea.start();
}
