// frontend/src/pages/remoteGamePage.ts

import { renderPage } from "../utils";
import { connectWebSocket, sendMessage } from "../socketService";
// Presumo que estas funções de componentes ainda existem
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";

// Função central para reagir às mensagens do servidor
function handleServerMessage(data: any) {
    console.log('Mensagem recebida no UI:', data);

    switch (data.type) {
        case 'matchCreated':
            const waitingText = document.getElementById('waiting-text');
            if (waitingText) {
                waitingText.innerHTML = `Partida criada!<br>Partilhe este ID com o seu amigo:<br><strong class="text-2xl mt-2 block">${data.sessionId}</strong>`;
            }
            break;
        
        case 'gameStart':
            console.log('O JOGO COMEÇOU! Oponente:', data.opponentId);
            alert('O JOGO VAI COMEÇAR!');
            // TODO: No Passo 5, vamos fazer a transição para o ecrã do jogo aqui.
            break;
            
        case 'error':
            alert(`Erro do servidor: ${data.message}`);
            // Re-ativa o botão de 'Join' se houver um erro para que o utilizador possa tentar novamente
            const joinBtn = document.getElementById('join-btn') as HTMLButtonElement | null;
            if (joinBtn) joinBtn.disabled = false;
            break;
    }
}

// Sua função `buildHostPage` original, mas com a lógica de WebSocket
function buildHostPage(): void {
    let selectedColor: string | null = "white"; // Cor padrão
    let selectedBackgroundImg = "/images/backgroundGame/back10.jpg";

    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen";
    renderPage(container);

    const title = document.createElement("h1");
    title.textContent = "Host Setup";
    title.className = "text-white font-orbitron font-bold text-4xl mb-8";
    container.appendChild(title);

    const onSelectBackground = (bg: string) => { selectedBackgroundImg = bg; };
    container.appendChild(BackgroundCarousel(onSelectBackground));

    const onSelectColor = (color: string) => { selectedColor = color; };
    const colorWrapper = document.createElement("div");
    colorWrapper.className = "flex flex-col items-center mt-6";
    const colorTitle = document.createElement("h2");
    colorTitle.textContent = "Your Paddle Color";
    colorTitle.className = "text-white font-orbitron font-bold mb-2";
    colorWrapper.appendChild(colorTitle);
    colorWrapper.appendChild(ColorSelector(onSelectColor));
    container.appendChild(colorWrapper);

    const startBtn = document.createElement("button");
    startBtn.textContent = "Criar Partida Online";
    startBtn.className = "mt-6 px-6 py-2 bg-green-600 text-white font-orbitron font-bold rounded hover:bg-green-700 transition";
    container.appendChild(startBtn);

    startBtn.addEventListener("click", () => {
        // Salva as escolhas localmente para usar no ecrã do jogo
        sessionStorage.setItem("playerColor", selectedColor ?? "white");
        sessionStorage.setItem("selectedBackground", selectedBackgroundImg);

        // Limpa a UI de setup e mostra a mensagem de espera
        container.innerHTML = "";
        const waitingMsg = document.createElement("h2");
        waitingMsg.id = 'waiting-text';
        waitingMsg.textContent = "A conectar e a criar partida...";
        waitingMsg.className = "text-white text-center font-orbitron font-bold text-xl animate-pulse";
        container.appendChild(waitingMsg);
        
        connectWebSocket(handleServerMessage);
        sendMessage({ type: 'createMatch' });
    });
}

// Sua função `buildGuestPage` original, mas com a lógica de WebSocket
function buildGuestPage(): void {
    let selectedColor: string | null = "white";
    let matchId: string = "";

    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen space-y-10";
    renderPage(container);

    const title = document.createElement("h1");
    title.textContent = "Join Game";
    title.className = "text-white font-orbitron font-bold text-4xl mb-8";
    container.appendChild(title);

    const box = document.createElement("div");
    box.className = "flex flex-col items-center bg-black/50 border border-[#00F0FF] rounded px-10 py-8";
    container.appendChild(box);

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "flex flex-col items-center mb-6";
    box.appendChild(inputWrapper);

    const matchLabel = document.createElement("label");
    matchLabel.textContent = "Enter Match ID";
    matchLabel.className = "text-white font-orbitron font-bold mb-2";
    inputWrapper.appendChild(matchLabel);

    const matchInput = document.createElement("input");
    matchInput.type = "text";
    matchInput.placeholder = "e.g. 12345";
    matchInput.className = "px-4 py-2 rounded border border-gray-400 text-black";
    matchInput.addEventListener("input", (e) => {
        matchId = (e.target as HTMLInputElement).value;
    });
    inputWrapper.appendChild(matchInput);

    const onSelectColor = (color: string) => { selectedColor = color; };
    const colorWrapper = document.createElement("div");
    colorWrapper.className = "flex flex-col items-center mt-2";
    box.appendChild(colorWrapper);
    const colorTitle = document.createElement("h2");
    colorTitle.textContent = "Your Paddle Color";
    colorTitle.className = "text-white font-orbitron font-bold mb-2";
    colorWrapper.appendChild(colorTitle);
    colorWrapper.appendChild(ColorSelector(onSelectColor));

    const joinBtn = document.createElement("button");
    joinBtn.id = 'join-btn';
    joinBtn.textContent = "Join Match";
    joinBtn.className = "mt-6 px-6 py-2 bg-blue-600 text-white font-orbitron font-bold rounded hover:bg-blue-700 transition";
    box.appendChild(joinBtn);

    joinBtn.addEventListener("click", () => {
        if (!matchId.trim()) {
            alert("Please enter a Match ID.");
            return;
        }
        joinBtn.disabled = true;

        sessionStorage.setItem("playerColor", selectedColor ?? "white");

        connectWebSocket(handleServerMessage);
        sendMessage({ type: 'joinMatch', sessionId: matchId.trim() });
    });
}

// Função que cria os cards com as imagens, exatamente como a sua original
function createRemoteGameUI(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "flex items-center justify-center w-full h-full gap-6";

    const cards = [
        { title: 'Host', imgSrc: '/images/remoteGame/host.jpeg', action: buildHostPage },
        { title: 'Guest', imgSrc: '/images/remoteGame/guest.jpeg', action: buildGuestPage },
    ];

    cards.forEach(({ title, imgSrc, action }) => {
        const card = document.createElement('a');
        card.className = 'relative w-80 h-3/4 overflow-hidden rounded border border-[#00F0FF] cursor-pointer transform transition-transform duration-300 hover:scale-105'; 
        card.style.backgroundImage = `url(${imgSrc})`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
        card.href = "#";

        card.addEventListener("click", (e) => {
            e.preventDefault();
            action(); // Ao clicar, chama a função de setup correspondente
        });
    
        const titleDiv = document.createElement('div');
        titleDiv.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-center py-3 font-orbitron font-bold text-lg';
        titleDiv.textContent = title;
    
        container.appendChild(card);
        card.appendChild(titleDiv);
    });

    return container;
}

// A função de entrada principal, que agora chama a sua `createRemoteGameUI`
export function buildRemoteGamePage(): void {
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen";
    renderPage(container);

    container.appendChild(createRemoteGameUI());
}