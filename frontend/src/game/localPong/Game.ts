import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { createGameUI } from '../../components/localGameUi';
import { API_ROUTES } from '../../config';
import { localLeaveDetector } from '../../logic/localLeaveDetector';
import type { GameSettings } from '../../types';
import i18next from "i18next";

type GameArea = {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    state: 'playing' | 'paused' | 'ended';
    start: () => void;
    stop: () => void;
    clear: () => void;
};


let lastGameSettings: GameSettings | null = null;
let player1: Paddle;
let player2: Paddle;
let ball: Ball;
let keysPressed: { [key: string]: boolean } = {};
let animationFrameId: number | null = null;
let currentGameMode: string;
let selectedGame: string | null = null;
let lastTime = 0;
let aiDecisionTimer = 1;
let aiTargetY = 0;
let winningScore = 3;
const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = true; };
const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = false; };
const paddleWidth = 10, paddleHeight = 80, paddleSpeed = 280;
const ballSpeed = 480, ballSize = 10;

function makeAIDecision() {
    const distanceX = player2.x - ball.x;
    if (ball.speedX < 0) {
        aiTargetY = myGameArea.canvas!.height / 2;
        return;
    }

    const timeToImpact = distanceX / ball.speedX;
    let predictedY = ball.y + ball.speedY * timeToImpact;
    const canvasHeight = myGameArea.canvas!.height;

    while (predictedY < 0 || predictedY > canvasHeight) {
        if (predictedY < 0) {
            predictedY = -predictedY;
        }
        if (predictedY > canvasHeight) {
            predictedY = canvasHeight - (predictedY - canvasHeight);
        }
    }

    const errorMargin = (Math.random() - 0.5) * paddleHeight * 1.3;
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

//Game singleton
const myGameArea: GameArea = {
    canvas: null,
    context: null,
    state: 'paused',

    start() {
        if (!this.canvas || !this.context) {
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

function showPowerUpMessage(message: string) {
    const alert = document.getElementById('power-up-alert');
    if (!alert) return;

    alert.textContent = message;

    alert.classList.remove('hidden');
    alert.classList.remove('opacity-0');
    alert.classList.add('opacity-100');

    setTimeout(() => {
        alert.classList.remove('opacity-100');
        alert.classList.add('opacity-0');
    }, 2000);
}

function setUpAiPowerUp() {
    const number = Math.floor(Math.random() * 3);
    if (number == 1) {
        player2.height = paddleHeight + 50;
        showPowerUpMessage(i18next.t("powerup_ai_size"));
    }
    else if (number == 2){
        player2.height = paddleHeight;
        player2.speed = paddleSpeed * 1.5;
        showPowerUpMessage(i18next.t("powerup_ai_speed"));
    }
    else {
        player2.power = 1.5;
        showPowerUpMessage(i18next.t("powerup_ai_power"));
    }
}

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
    const effectivePaddle1Speed = player1.speed;
    const effectivePaddle2Speed = player2.speed;

    if (keysPressed['w'] && player1.y > 0) { 
        player1.y -= effectivePaddle1Speed * deltaTime; 
    }
    if (keysPressed['s'] && player1.y < myGameArea.canvas!.height - player1.height) { 
        player1.y += effectivePaddle1Speed * deltaTime; 
    }
    if (keysPressed['arrowup'] && player2.y > 0) { 
        player2.y -= effectivePaddle2Speed * deltaTime; 
    }
    if (keysPressed['arrowdown'] && player2.y < myGameArea.canvas!.height - player2.height) { 
        player2.y += effectivePaddle2Speed * deltaTime; 
    }
}

function checkCollisions() {
    if (
        ball.speedX < 0 &&
        ball.x - ball.size < player1.x + player1.width &&
        ball.x + ball.size > player1.x &&
        ball.y + ball.size > player1.y &&
        ball.y - ball.size < player1.y + player1.height
    ) {
        ball.x = player1.x + player1.width + ball.size;
        player1.touches++;

        const hitPos = (ball.y - (player1.y + player1.height / 2)) / (player1.height / 2);

        ball.speed = ballSpeed;
        ball.speed = ball.speed * player1.power;
        const angle = hitPos * (Math.PI / 4);
        ball.speedX = Math.cos(angle) * ball.speed;
        ball.speedY = Math.sin(angle) * ball.speed;
    }

    if (
        ball.speedX > 0 &&
        ball.x + ball.size > player2.x &&
        ball.x - ball.size < player2.x + player2.width &&
        ball.y + ball.size > player2.y &&
        ball.y - ball.size < player2.y + player2.height
    ) {
        ball.x = player2.x - ball.size;
        player2.touches++;

        const hitPos = (ball.y - (player2.y + player2.height / 2)) / (player2.height / 2);

        ball.speed = ballSpeed;
        ball.speed = ball.speed * player2.power;
        const angle = hitPos * (Math.PI / 4);
        ball.speedX = -Math.cos(angle) * ball.speed;
        ball.speedY = Math.sin(angle) * ball.speed;
    }
}

function setUpPlayerPowerUp(player: Paddle) {
    const number = Math.floor(Math.random() * 3);
    
    if (number === 1) {
        player.height = paddleHeight + 50;
        player.speed = paddleSpeed;
        player.power = 1;
        showPowerUpMessage(i18next.t("powerup_size", { player: player.name }));
    }
    else if (number === 2){
        player.speed = paddleSpeed * 2;
        player.height = paddleHeight;
        player.power = 1;
        showPowerUpMessage(i18next.t("powerup_speed", { player: player.name }));
    }
    else {
        player.power = 1.5;
        player.speed = paddleSpeed;
        player.height = paddleHeight;
        showPowerUpMessage(i18next.t("powerup_power", { player: player.name }));
    }
}

function checkPlayerPowerUp() {
    if (selectedGame === "default") return;
    if (player1.score >= winningScore || player2.score >= winningScore) return;
    
    if (player1.score > player2.score) {
        setUpPlayerPowerUp(player2);
    }
    else if (player2.score > player1.score) {
        setUpPlayerPowerUp(player1);
    }
    else {
        player1.power = 1;
        player1.height = paddleHeight;
        player1.speed = paddleSpeed;
        player2.power = 1;
        player2.height = paddleHeight;
        player2.speed = paddleSpeed;
    }
}

function checkScore() {
    let winnerName: string | null = null;

    if (ball.x - ball.size < 0) {
        player2.score++;
        checkPlayerPowerUp();
        updateScoreboard();
        if (player2.score >= winningScore) {
            winnerName = player2.name;
        } else {
            ball.reset();
        }
    } else if (ball.x + ball.size > myGameArea.canvas!.width) {
        player1.score++;
        checkPlayerPowerUp();
        updateScoreboard();
        if (player1.score >= winningScore) {
            winnerName = player1.name;
        } else {
            ball.reset();
        }
    }

    if (winnerName) {
        endGame(winnerName);
    }
}

async function endGame(winnerName: string) {
    myGameArea.stop();
    localLeaveDetector.stop();

    const gameOverScreen = document.getElementById('game-over-screen');
    const winnerText = document.getElementById('winner-text');

    if (gameOverScreen && winnerText) {
        winnerText.textContent = i18next.t("winner_text", { player: winnerName });
        gameOverScreen.classList.remove('hidden');
    }
    
    try {
        await fetch(`${API_ROUTES.registerMatch}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: new Date().toISOString(),
      participants: [
        {
          username: player1.name,
          goals: player1.score,
          isLocal: false,
          touches: player1.touches
        },
        {
          username: player2.name,
          goals: player2.score,
          isLocal: true,
          touches: player2.touches
        }
      ]
    })})
    } catch (err) {
        console.error("Error saving the match.", err);
    }
}

function updateScoreboard() {
    const p1ScoreElement = document.getElementById('game-player1-score');
    const p2ScoreElement = document.getElementById('game-player2-score');

    if (p1ScoreElement) 
        p1ScoreElement.textContent = player1.score.toString();
    if (p2ScoreElement) 
        p2ScoreElement.textContent = player2.score.toString();
}

function setupRestartButton(): void {
    const restartButton = document.getElementById('restart-button') as HTMLButtonElement | null;

    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    } else {
        console.warn('Error! Restart button not found.');
    }
}

function restartGame(): void {
    if (lastGameSettings) {
        localLeaveDetector.stop();

        initializeLocalGame(
            lastGameSettings.containerId,
            lastGameSettings.width,
            lastGameSettings.height,
            lastGameSettings.mode,
            player1.name,
            player2.name,
            lastGameSettings.gameMode
        );
    } else {
        console.error('Error. Initial Settings not found.');
    }
}

export function cleanupGame(): void {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
}

export function initializeLocalGame(containerId: string, width: number, height: number, mode: string, player1Name: string, player2Name: string, gameMode: string) {
    cleanupGame();

    selectedGame = sessionStorage.getItem('selectedGameMode');
    currentGameMode = mode;
    const container = document.getElementById(containerId);
    lastGameSettings = { containerId, width, height, mode, gameMode };

    if (!container) {
        return;
    }
    const savedBackground = sessionStorage.getItem('selectedBackground');

    container.innerHTML = '';
    const gameUI = createGameUI();
    container.appendChild(gameUI);

    myGameArea.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!myGameArea.canvas) {
        console.error('Error. No #game-canvas.');
        return;
    }

    myGameArea.context = myGameArea.canvas.getContext('2d');
    myGameArea.canvas.width = width;
    myGameArea.canvas.height = height;

    if (savedBackground) {
        myGameArea.canvas.style.backgroundImage = `url(${savedBackground})`;
        myGameArea.canvas.style.backgroundSize = 'cover';
        myGameArea.canvas.style.backgroundPosition = 'center';
    } else {
        myGameArea.canvas.style.backgroundColor = 'black';
    }

    player1 = new Paddle(paddleWidth, myGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP1') || 'white', player1Name);
    player2 = new Paddle(myGameArea.canvas.width - paddleWidth * 2, myGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP2') || 'white', player2Name);
    ball = new Ball(myGameArea.canvas.width / 2, myGameArea.canvas.height / 2, ballSize, ballSpeed, myGameArea.canvas);

    if (mode === "ai" && selectedGame === "default")
        setUpAiPowerUp();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);  

    setupRestartButton();
    startCountdown(3, () => {
        myGameArea.start(); 
    });
}

function startCountdown(duration: number, callback: () => void) {
    if (!myGameArea.canvas) 
        return;
    const ctx = myGameArea.context!;
    let timeLeft = duration;

    drawCountdownOverlay(ctx, timeLeft);

    const countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            callback();
            return;
        }
        drawCountdownOverlay(ctx, timeLeft);
    }, 1000);
}


function drawCountdownOverlay(ctx: CanvasRenderingContext2D, number: number) {
    myGameArea.clear();

    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, myGameArea.canvas!.width, myGameArea.canvas!.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), myGameArea.canvas!.width / 2, myGameArea.canvas!.height / 2);
}