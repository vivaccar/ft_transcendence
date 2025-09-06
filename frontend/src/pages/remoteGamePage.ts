import { renderPage } from "../utils";
import { connectWebSocket, sendMessage } from "../socketService";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";
import { initGame, startGame, updateGameState, showGameOver, stopGame } from "../game/remotePong/RemoteGame";
import { loadUserProfile } from "../game/localPong/Pong"

function handleServerMessage(data: any) {
    //DEBUG - NAO EXCLUIR AINDA
    console.log(`📡 [WS RECEBIDO] Tipo: ${data.type}`, data);
    switch (data.type) {
        case 'matchCreated':
            //DEBUG - NAO EXCLUIR AINDA
            console.log("✅ [LÓGICA] Partida criada com sucesso. Exibindo ID da sessão:", data.sessionId);
            const waitingText = document.getElementById('waiting-text');
            if (waitingText) {
                //ISSO PRECISA IR PRA INGLES
                waitingText.innerHTML = `Partida criada!<br>Partilhe este ID com o seu amigo:<br><strong class="text-2xl mt-2 block">${data.sessionId}</strong>`;
            }
            break;
    
        case 'gameStart': {
            //DEBUG - NAO EXCLUIR AINDA
            console.log("🚀 [LÓGICA] Recebido sinal de 'gameStart'.", data);

            //ESSE IF PODE SER UM TRY CATCH

            if (data.background) {
                console.log('DEBUG 2: Entrou no "if (data.background)". Tentando atualizar o sessionStorage...');

                const settingsStr = sessionStorage.getItem('gameSettings');
                if (settingsStr) {
                    const settings = JSON.parse(settingsStr);
                    settings.background = data.background;
                    settings.p1_alias = data.p1Name,
                    settings.p2_alias = data.p2Name,
                    sessionStorage.setItem('gameSettings', JSON.stringify(settings));
                } else {
                    //DEBUG - NAO EXCLUIR AINDA
                    console.error('DEBUG FALHOU: Não encontrou "gameSettings" no sessionStorage no momento de atualizar o background.');
                }
            } else {
                console.warn('DEBUG AVISO: A mensagem "gameStart" foi recebida, mas não continha a propriedade "background".');
            }

            const appContainer = document.querySelector('#app > div');
            if (!appContainer) {
                //DEBUG - NAO EXCLUIR AINDA (PODE SER UM TRY CATCH)
                console.error("🐛 [ERRO] Container principal da aplicação não encontrado! Não é possível iniciar o jogo.");
                return;
            }
            appContainer.className = 'w-full h-screen flex justify-center items-center';
            appContainer.innerHTML = '';
            initGame(appContainer as HTMLElement);
            startGame();
            break;
        }

        case 'gameStateUpdate':
            //DEBUG - NAO EXCLUIR AINDA
            console.log("🔄 [JOGO] Atualização de estado recebida.");
            updateGameState(data.payload);
            break;

        case 'gameOver':
            //DEBUG - NAO EXCLUIR AINDA
            console.log(`🏆 [JOGO] Fim de jogo! Vencedor: ${data.payload.winnerName}`);
            showGameOver(data.payload.winnerName);
            break;
        case 'error':
            //DEBUG - NAO EXCLUIR AINDA
            console.error(`🐛 [ERRO SERVIDOR] Mensagem de erro recebida:`, data.message);
            alert(`Erro do servidor: ${data.message}`);
            //DEBUG - NAO EXCLUIR AINDA
            console.log("🛑 [JOGO] Parando o jogo devido a um erro.");
            stopGame();
            const joinBtn = document.getElementById('join-btn') as HTMLButtonElement | null;
            if (joinBtn) {
                //DEBUG - NAO EXCLUIR AINDA
                console.log("🔧 [UI] Reativando o botão 'Join' após erro.");
                joinBtn.disabled = false;
            }
            break;

        default:
            //MUDAR ESSA MENSAGEM LIXO
            console.warn(`🤔 [WS] Mensagem de tipo desconhecido recebida: ${data.type}`);
    }
}

//MUITA COISA AQUI DENTRO PODE SER COMPONENTE - ARRUMAR ISSO DE MANERIA DESCENTE
async function buildHostPage(): Promise <void> {
    //DEBUG - NAO EXCLUIR AINDA
    console.log("🛠️ [UI] Construindo a página 'Host Setup'...");

    const loggedUserData = await loadUserProfile();
    let selectedColor: string | null = "white";
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
        //DEBUG - NAO EXCLUIR AINDA
        console.log("➡️ [AÇÃO] Botão 'Criar Partida Online' clicado.");

        const gameSettings = {
            p1_color: selectedColor ?? "white",
            p2_color: "white",
            background: selectedBackgroundImg,
            //Quando for colocar o nick do usuario, é aqui VISSE VIVACCAR
            p1_alias: loggedUserData.username ?? 'Host',
            p2_alias: "Waiting for player 2."
        };
        sessionStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        //DEBUG - NAO EXCLUIR AINDA
        console.log("💾 [DADOS] Objeto 'gameSettings' salvo na sessionStorage.", gameSettings);
        
        container.innerHTML = "";
        const waitingMsg = document.createElement("h2");
        waitingMsg.id = 'waiting-text';
        //ISSO TEM DE SER INGLES
        waitingMsg.textContent = "A conectar e a criar partida...";
        waitingMsg.className = "text-white text-center font-orbitron font-bold text-xl animate-pulse";
        container.appendChild(waitingMsg);

        //DEBUG - NAO EXCLUIR AINDA
        console.log("🔌 [WS] Tentando conectar ao WebSocket...");
        connectWebSocket(handleServerMessage);

        setTimeout(() => {
            //DEBUG - NAO EXCLUIR AINDA
            console.log("📤 [WS ENVIADO] Enviando mensagem 'createMatch'...");
            sendMessage({
                type: 'createMatch',
                payload: { 
                    color: selectedColor ?? 'white', 
                    background: selectedBackgroundImg,
                    playerName: loggedUserData.username ?? 'Host'
                }
            });
        }, 500);
    });
}

//MUITA COISA AQUI PODE SER COMPONENTE 
async function buildGuestPage(): Promise <void> {
    //DEBUG - NAO EXCLUIR AINDA
    console.log("🛠️ [UI] Construindo a página 'Join Game'...");

    const loggedUserData = await loadUserProfile();
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
    matchInput.addEventListener("input", (e) => { matchId = (e.target as HTMLInputElement).value; });
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
        //DEBUG - NAO EXCLUIR AINDA
        console.log("➡️ [AÇÃO] Botão 'Join Match' clicado.");
        if (!matchId.trim()) {
            //DEBUG - NAO EXCLUIR AINDA
            console.warn("⚠️ [VALIDAÇÃO] Tentativa de join sem Match ID.");
            alert("Please enter a Match ID.");
            return;
        }
        joinBtn.disabled = true;

        const gameSettings = {
            p1_color: "white",
            p2_color: selectedColor ?? "white",
            background: "/images/backgroundGame/back10.jpg", // Background Padrão
            p1_alias: "Host",
            p2_alias: loggedUserData.username ?? "Guest"
        };
        sessionStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        //DEBUG - NAO EXCLUIR AINDA
        console.log("💾 [DADOS] Objeto 'gameSettings' salvo na sessionStorage.", gameSettings);
        console.log("🔌 [WS] Tentando conectar ao WebSocket...");

        connectWebSocket(handleServerMessage);

        setTimeout(() => {
            //DEBUG - NAO EXCLUIR AINDA
            console.log(`📤 [WS ENVIADO] Enviando mensagem 'joinMatch' com ID: ${matchId.trim()}`);
            sendMessage({
                type: 'joinMatch',
                payload: {
                    sessionId: matchId.trim(),
                    color: selectedColor ?? 'white',
                    playerName: loggedUserData.username ?? 'Guest'
                }
            });
        }, 500);
    });
}


function createRemoteGameUI(): HTMLDivElement {
    //DEBUG - NAO EXCLUIR AINDA
    console.log("🎨 [UI] Criando a UI de seleção (Host/Guest)...");
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
            console.log(`➡️ [AÇÃO] Cartão '${title}' clicado.`);
            action();
        });
        const titleDiv = document.createElement('div');
        titleDiv.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-center py-3 font-orbitron font-bold text-lg';
        titleDiv.textContent = title;
        card.appendChild(titleDiv);
        container.appendChild(card);
    });
    return container;
}
export function buildRemoteGamePage(): void {
    //DEBUG - NAO EXCLUIR AINDA
    console.log("🚀 [ROTA] Iniciando a construção da 'remoteGamePage'.");
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen";
    renderPage(container);
    container.appendChild(createRemoteGameUI());
}
