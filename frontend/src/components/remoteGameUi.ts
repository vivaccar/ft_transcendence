import i18next from "i18next";

// /frontend/srcs/components/remoteGameUi.ts (NOVO FICHEIRO)

// Esta função é uma cópia da sua createGameUI, mas adaptada para o jogo remoto.

export function createRemoteGameUI(): HTMLElement {
    // 1. Criar o elemento raiz
    const root = document.createElement('div');
    root.className = 'flex flex-col items-center justify-center gap-4'; // Modificado para centralizar placar e canvas

    // 2. Criar o placar (scoreboard) - sem alterações
    const scoreboard = document.createElement('div');
    scoreboard.className = 'text-6xl font-mono text-center text-white';
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

    // 3. Criar o canvas do jogo - sem alterações
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.className = 'bg-black border-2 border-white rounded-lg';

    // 4. Criar o ecrã de fim de jogo (game over screen) - sem alterações
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.className = 'hidden absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-6';

    const winnerText = document.createElement('h2');
    winnerText.id = 'winner-text';
    winnerText.className = 'text-5xl font-orbitron font-bold text-white font-mono';

    // 🔥 ===== INÍCIO DA MUDANÇA PRINCIPAL ===== 🔥
    
    // 5. Criar um contêiner para os novos botões
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-row gap-8'; // Alinha os botões horizontalmente

    // 6. Botão "Jogar Novamente" (leva para a tela de setup do jogo remoto)
    const playAgainButton = document.createElement('button');
    playAgainButton.id = 'play-again-button'; // ID específico para o jogo remoto
    playAgainButton.className = "bg-green-600 text-white px-6 py-3 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-green-700";
    playAgainButton.textContent = i18next.t("play_again");

    // 7. Botão "Página Principal"
    const homeButton = document.createElement('button');
    homeButton.id = 'home-button'; // ID específico
    homeButton.textContent = i18next.t("back_to_menu");
    homeButton.className = "bg-gray-600 text-white px-6 py-3 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-gray-700";
    
    // NOTA: A lógica 'onclick' foi REMOVIDA daqui. Ela será adicionada dinamicamente
    // no ficheiro RemoteGame.ts, que é o lugar correto para a lógica de controlo.

    buttonContainer.appendChild(playAgainButton);
    buttonContainer.appendChild(homeButton);

    gameOverScreen.appendChild(winnerText);
    gameOverScreen.appendChild(buttonContainer);
    
    // 🔥 ===== FIM DA MUDANÇA PRINCIPAL ===== 🔥

    // 8. Montar a estrutura final
    root.appendChild(scoreboard);
    root.appendChild(canvas);
    root.appendChild(gameOverScreen);

    // 9. Retornar o elemento raiz completo
    return root;
}