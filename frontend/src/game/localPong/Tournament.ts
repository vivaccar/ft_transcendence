import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { createGameUI } from '../../components/localGameUi';
import { buildHumanGameLocal } from './Pong';
import { navigate } from '../../router';
import i18next from "i18next";

type GameArea = { 
    canvas: HTMLCanvasElement | null; 
    context: CanvasRenderingContext2D | null; 
    state: 'playing' | 'paused' | 'ended'; 
    start: () => void; 
    stop: () => void; 
    clear: () => void; 
};

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
let lastTime = 0;
let winningScore = 5;

const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = true; };
const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = false; };

const tournamentGameArea: GameArea = {
    canvas: null, context: null, state: 'paused',
    start() {
        if (!this.canvas || !this.context) return;
        this.state = 'playing';
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updateTournamentGameArea);
    },
    clear() {
        if (this.context && this.canvas)
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        this.state = 'ended';
    },
};

function showTournamentTransitionScreen(title: string, message: string, buttonText: string, action: () => void) {
    const container = document.getElementById('game-container');

    if (!container) 
        return;

    container.innerHTML = '';
    container.className = 'bg-black/80 p-10 rounded-lg flex flex-col items-center justify-center gap-6 text-white text-center w-[600px] h-[400px]';
    const titleEl = document.createElement('h1');
    titleEl.className = 'text-5xl font-bold font-orbitron';
    titleEl.textContent = title;
    const messageEl = document.createElement('p');
    messageEl.className = 'text-2xl mt-4';
    messageEl.textContent = message;
    const nextButton = document.createElement('button');
    nextButton.className = 'mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-xl';
    nextButton.textContent = buttonText;
    nextButton.onclick = action;
    container.appendChild(titleEl);
    container.appendChild(messageEl);
    container.appendChild(nextButton);
}

function handleTournamentMatchEnd(winnerName: string) {
    const gameMode = sessionStorage.getItem('gameMode');
    let title: string, message: string, buttonText: string, nextAction: () => void;

    switch (gameMode) {
        case 'tournament_semi_1':
            const p1Name = sessionStorage.getItem('tournament_p1_name');
            const winnerKey1 = winnerName === p1Name ? 'p1' : 'p2';
            sessionStorage.setItem('tournament_finalist1_name', sessionStorage.getItem(`tournament_${winnerKey1}_name`)!);
            sessionStorage.setItem('tournament_finalist1_color', sessionStorage.getItem(`tournament_${winnerKey1}_color`)!);
            title = i18next.t("tournament_winner_title", { winnerName });
            message = i18next.t("tournament_next_message", { 
              p3: sessionStorage.getItem("tournament_p3_name"),
              p4: sessionStorage.getItem("tournament_p4_name")
            });
            buttonText = i18next.t("tournament_next_button");
            nextAction = () => {
                sessionStorage.setItem('playerName1', sessionStorage.getItem('tournament_p3_name')!);
                sessionStorage.setItem('selectedColorP1', sessionStorage.getItem('tournament_p3_color')!);
                sessionStorage.setItem('playerName2', sessionStorage.getItem('tournament_p4_name')!);
                sessionStorage.setItem('selectedColorP2', sessionStorage.getItem('tournament_p4_color')!);
                sessionStorage.setItem('gameMode', 'tournament_semi_2');
                buildHumanGameLocal('tournament');
            };
            break;
        case 'tournament_semi_2':
            const p3Name = sessionStorage.getItem('tournament_p3_name');
            const winnerKey2 = winnerName === p3Name ? 'p3' : 'p4';
            sessionStorage.setItem('tournament_finalist2_name', sessionStorage.getItem(`tournament_${winnerKey2}_name`)!);
            sessionStorage.setItem('tournament_finalist2_color', sessionStorage.getItem(`tournament_${winnerKey2}_color`)!);
            title = i18next.t("tournament_final_title", { winnerName });
            message = i18next.t("tournament_final_message", {
                f1: sessionStorage.getItem("tournament_finalist1_name"),
                f2: sessionStorage.getItem("tournament_finalist2_name")
            });
            buttonText = i18next.t("tournament_final_button");
            nextAction = () => {
                sessionStorage.setItem('playerName1', sessionStorage.getItem('tournament_finalist1_name')!);
                sessionStorage.setItem('selectedColorP1', sessionStorage.getItem('tournament_finalist1_color')!);
                sessionStorage.setItem('playerName2', sessionStorage.getItem('tournament_finalist2_name')!);
                sessionStorage.setItem('selectedColorP2', sessionStorage.getItem('tournament_finalist2_color')!);
                sessionStorage.setItem('gameMode', 'tournament_final');
                buildHumanGameLocal('tournament');
            };
            break;
        case 'tournament_final':
            title = i18next.t("end_tournament_title");
            message = i18next.t("end_tournament_message", { winnerName });
            buttonText = i18next.t("end_tournament_button");
            nextAction = () => {
                Object.keys(sessionStorage).forEach(key => { if (key.startsWith('tournament_') || key.startsWith('player') || key.startsWith('selected')) sessionStorage.removeItem(key); });
                navigate('/');
            };
            break;
        default:
            title = 'Error'; message = 'An error has ocurred'; buttonText = 'Back to main menu';
            nextAction = () => navigate('/');
            break;
    }
    showTournamentTransitionScreen(title, message, buttonText, nextAction);
}

function tournamentCheckScore() {
    let winnerName: string | null = null;
    const p1Name = sessionStorage.getItem('playerName1')!;
    const p2Name = sessionStorage.getItem('playerName2')!;
    const p1ScoreElement = document.getElementById('game-player1-score');
    const p2ScoreElement = document.getElementById('game-player2-score');

    if (ball.x - ball.size < 0) {
        player2.score++;
        if (p2ScoreElement) {
            p2ScoreElement.textContent = player2.score.toString();
        }
        if (player2.score >= winningScore) 
            winnerName = p2Name;
        else 
            ball.reset();
    } else if (ball.x + ball.size > tournamentGameArea.canvas!.width) {
        player1.score++;
        if (p1ScoreElement) {
            p1ScoreElement.textContent = player1.score.toString();
        }
        if (player1.score >= winningScore) 
            winnerName = p1Name;
        else 
            ball.reset();
    }

    if (winnerName) 
        tournamentEndGame(winnerName);
}

function tournamentEndGame(winnerName: string) {
    tournamentGameArea.stop();
    handleTournamentMatchEnd(winnerName);
}

function setupTournamentRestartButton(): void {
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.onclick = () => {
            if (lastGameSettings) 
                initializeTournamentMatch(lastGameSettings.containerId, lastGameSettings.width, lastGameSettings.height, lastGameSettings.mode);
        };
    }
}

function cleanupTournamentGame(): void {
    if (animationFrameId) 
        cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
}

function draw() {
    const ctx = tournamentGameArea.context!;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; 
    ctx.lineWidth = 4; 
    ctx.setLineDash([10, 10]);
    ctx.beginPath(); 
    ctx.moveTo(tournamentGameArea.canvas!.width / 2, 0); 
    ctx.lineTo(tournamentGameArea.canvas!.width / 2, 
    tournamentGameArea.canvas!.height); 
    ctx.stroke();
    ctx.setLineDash([]); 
    player1.draw(ctx); 
    player2.draw(ctx); 
    ball.draw(ctx);
}

function handleInput(deltaTime: number) {
    const speed = player1.speed;

    if (keysPressed['w'] && player1.y > 0) 
        player1.y -= speed * deltaTime;
    if (keysPressed['s'] && player1.y < tournamentGameArea.canvas!.height - player1.height) 
        player1.y += speed * deltaTime;
    if (keysPressed['arrowup'] && player2.y > 0) 
        player2.y -= speed * deltaTime;
    if (keysPressed['arrowdown'] && player2.y < tournamentGameArea.canvas!.height - player2.height) 
        player2.y += speed * deltaTime;
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
        const hitPos = (ball.y - (player1.y + player1.height / 2)) / (player1.height / 2);
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
        const hitPos = (ball.y - (player2.y + player2.height / 2)) / (player2.height / 2);

        const angle = hitPos * (Math.PI / 4);
        ball.speedX = -Math.cos(angle) * ball.speed;
        ball.speedY = Math.sin(angle) * ball.speed;
    }
}


function updateTournamentGameArea(currentTime: number) {
    if (tournamentGameArea.state !== 'playing')
        return;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    handleInput(deltaTime);
    ball.update(deltaTime);
    checkCollisions();
    tournamentCheckScore();
    tournamentGameArea.clear();
    draw();
    animationFrameId = requestAnimationFrame(updateTournamentGameArea);
}


export function initializeTournamentMatch(containerId: string, width: number, height: number, mode: string) {
    cleanupTournamentGame();
    const container = document.getElementById(containerId);
    lastGameSettings = { 
        containerId, width, height, mode 
    };
    if (!container) 
        return;
    const savedBackground = sessionStorage.getItem('selectedBackground');
    container.innerHTML = '';
    const gameUI = createGameUI();
    container.appendChild(gameUI);
    tournamentGameArea.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    if (!tournamentGameArea.canvas) 
        return;
    tournamentGameArea.context = tournamentGameArea.canvas.getContext('2d');
    tournamentGameArea.canvas.width = width;
    tournamentGameArea.canvas.height = height;
    if (savedBackground) {
        tournamentGameArea.canvas.style.backgroundImage = `url(${savedBackground})`;
        tournamentGameArea.canvas.style.backgroundSize = 'cover';
    } else {
        tournamentGameArea.canvas.style.backgroundColor = 'black';
    }
    const paddleWidth = 10, paddleHeight = 100, paddleSpeed = 300;
    const ballSize = 10, ballSpeed = 450;

    player1 = new Paddle(paddleWidth, tournamentGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP1') || 'white', "");
    player2 = new Paddle(tournamentGameArea.canvas.width - paddleWidth * 2, tournamentGameArea.canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleSpeed, sessionStorage.getItem('selectedColorP2') || 'white', "");
    ball = new Ball(tournamentGameArea.canvas.width / 2, tournamentGameArea.canvas.height / 2, ballSize, ballSpeed, tournamentGameArea.canvas);
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    setupTournamentRestartButton();
    tournamentGameArea.start();
}