import { navigate } from "../router";
import i18next from "i18next";

export function createGameUI(): HTMLElement {
    // 1. Criar o elemento raiz
    const root = document.createElement('div');
    root.className = 'relative w-full h-full flex flex-col items-center gap-4';

    // 2. Criar o placar (scoreboard)
    const scoreboard = document.createElement('div');
    scoreboard.className = 'text-6xl font-mono text-center text-white bg-transparent shadow-none';
    
    const p1Score = document.createElement('span');
    p1Score.id = 'game-player1-score';
    p1Score.textContent = '0';

    const separator = document.createTextNode(' - ');

    const p2Score = document.createElement('span');
    p2Score.id = 'game-player2-score';
    p2Score.textContent = '0';

    scoreboard.appendChild(p1Score);
    scoreboard.appendChild(separator);
    scoreboard.appendChild(p2Score);

    // power up alert
    const powerUpAlert = document.createElement('div');
    powerUpAlert.id = 'power-up-alert';
    powerUpAlert.className = 'hidden absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-purple-800 text-white py-2 px-4 rounded-lg text-xl z-50 opacity-0 transition-opacity duration-300';

    // 3. Criar contêiner do canvas (para overlay relativo)
    const canvasContainer = document.createElement('div');
    canvasContainer.className = "relative inline-block";

    // Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.className = 'bg-black border-2 border-white rounded-lg';

    // 4. Criar o ecrã de fim de jogo (overlay dentro do container do canvas)
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.className = 'hidden absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 rounded-lg';

    const winnerText = document.createElement('h2');
    winnerText.id = 'winner-text';
    winnerText.className = `
        text-xl md:text-3xl lg:text-6xl
        font-orbitron font-bold
        text-transparent bg-clip-text
        bg-white
        text-center
    `;

    // Contêiner para botões lado a lado
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-row gap-8';

    // Botão de reiniciar
    const restartButton = document.createElement('button');
    restartButton.id = 'restart-button';
    restartButton.className = "bg-[#193D5E] text-white px-4 py-2 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-indigo-600";
    restartButton.textContent = i18next.t("play_again");

    // Botão "Página Principal"
    const homeButton = document.createElement('button');
    homeButton.textContent = i18next.t("games_page");
    homeButton.className = "bg-[#193D5E] text-white px-4 py-2 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-indigo-600";
    homeButton.onclick = () => navigate('./games');

    buttonContainer.appendChild(restartButton);
    buttonContainer.appendChild(homeButton);

    gameOverScreen.appendChild(winnerText);
    gameOverScreen.appendChild(buttonContainer);

    
    // Montar canvas + overlay no container
    canvasContainer.appendChild(canvas);
    canvasContainer.appendChild(gameOverScreen);
    
    // 5. Montar a estrutura final
    root.appendChild(scoreboard);
    root.appendChild(powerUpAlert);
    root.appendChild(canvasContainer);

    // 6. Retornar o elemento raiz completo
    return root;
}
