import { navigate } from "../router";

export function createGameUI(): HTMLElement {
    // 1. Criar o elemento raiz
    const root = document.createElement('div');
    root.className = 'relative w-full h-full';

    // 2. Criar o placar (scoreboard)
    const scoreboard = document.createElement('div');
    scoreboard.className = 'text-6xl mb-4 font-mono text-center text-white';

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

    // 3. Criar o canvas do jogo
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.className = 'bg-black border-2 border-white rounded-lg';

    // 4. Criar o ecrã de fim de jogo (game over screen)
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.className = 'hidden absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-6';

    const winnerText = document.createElement('h2');
    winnerText.id = 'winner-text';
    winnerText.className = 'text-5xl font-orbitron font-bold text-white font-mono';

    // 5. Criar um contêiner para os botões ficarem lado a lado
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-row gap-8'; // Alinha os botões horizontalmente com um espaçamento

    // 6. Botão de reiniciar
    const restartButton = document.createElement('button');
    restartButton.id = 'restart-button';
    restartButton.className = "bg-[#193D5E] text-white px-4 py-2 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-indigo-600";
    restartButton.textContent = 'Play again';

    // 7. Botão "Página Principal"
    const homeButton = document.createElement('button');
    homeButton.textContent = 'Games Page';
    homeButton.className = "bg-[#193D5E] text-white px-4 py-2 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-indigo-600";

    homeButton.onclick = () => {
        navigate('./games');
    };

    // Adicionar os botões ao seu contêiner
    buttonContainer.appendChild(restartButton);
    buttonContainer.appendChild(homeButton);

    // Adicionar o texto do vencedor e o contêiner de botões ao ecrã final
    gameOverScreen.appendChild(winnerText);
    gameOverScreen.appendChild(buttonContainer);

    // 5. Montar a estrutura final
    root.appendChild(scoreboard);
    root.appendChild(canvas);
    root.appendChild(gameOverScreen);

    // 6. Retornar o elemento raiz completo
    return root;
}