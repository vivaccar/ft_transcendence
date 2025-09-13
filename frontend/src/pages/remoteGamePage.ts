import { renderPage } from "../utils";
import { connectWebSocket, sendMessage} from "../socketService";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";
import { initGame, startGame, updateGameState, showGameOver, stopGame } from "../game/remotePong/RemoteGame";
import { loadUserProfile } from "../game/localPong/Pong"
import { leaveDetector } from "../logic/remoteLeaveDetector";
import i18next from "i18next";


function handleServerMessage(data: any) {
    switch (data.type) {
        case 'matchCreated':
            const waitingText = document.getElementById('waiting-text');
            if (waitingText) {
                waitingText.innerHTML = i18next.t("match_created", { sessionId: data.sessionId });
            }
            break;
    
        case 'gameStart': {

            if (data.background) {
                const settingsStr = sessionStorage.getItem('gameSettings');
                if (settingsStr) {
                    const settings = JSON.parse(settingsStr);
                    settings.background = data.background;
                    settings.p1_alias = data.p1Name;
                    settings.p2_alias = data.p2Name;
                    sessionStorage.setItem('gameSettings', JSON.stringify(settings));
                }
            }

            const appContainer = document.querySelector('#app > div');
            if (!appContainer) {
                return;
            }
            appContainer.className = 'w-full h-screen flex justify-center items-center';
            appContainer.innerHTML = '';
            initGame(appContainer as HTMLElement);
            startGame();
            leaveDetector.start();
            break;
        }

        case 'gameStateUpdate':
            updateGameState(data.payload);
            break;

        case 'gameOver':
            leaveDetector.stop();
            showGameOver(data.payload.winnerName);
            break;

        case 'error':
            leaveDetector.stop();
            alert(`Erro do servidor: ${data.message}`);
            stopGame();
            const joinBtn = document.getElementById('join-btn') as HTMLButtonElement | null;
            if (joinBtn) {
                joinBtn.disabled = false;
            }
            break;

        case 'opponentLeft':
            leaveDetector.stop();
            stopGame();
            alert(i18next.t("opponent_left"));
            break;

        default:
            console.warn(`Error. Not know message received: ${data.type}`);
    }
}

async function buildHostPage(): Promise <void> {
    const loggedUserData = await loadUserProfile();
    let selectedColor: string | null = "white";
    let selectedBackgroundImg = "/images/backgroundGame/back10.jpg";
    const container = document.createElement("div");

    container.className = "flex flex-col items-center justify-center h-screen";
    renderPage(container);

    const title = document.createElement("h1");
    title.textContent = i18next.t("host_setup");
    title.className = "text-white font-orbitron font-bold text-4xl mb-8";
    container.appendChild(title);
    const onSelectBackground = (bg: string) => { selectedBackgroundImg = bg; };
    container.appendChild(BackgroundCarousel(onSelectBackground));
    const onSelectColor = (color: string) => { selectedColor = color; };
    const colorWrapper = document.createElement("div");
    colorWrapper.className = "flex flex-col items-center mt-6";
    colorWrapper.appendChild(ColorSelector(onSelectColor));
    container.appendChild(colorWrapper);
    const startBtn = document.createElement("button");
    startBtn.textContent = i18next.t("create_online_game");
    startBtn.className = "mt-6 px-6 py-2 bg-green-600 text-white font-orbitron font-bold rounded hover:bg-green-700 transition";
    container.appendChild(startBtn);


    startBtn.addEventListener("click", () => {
        const gameSettings = {
            p1_color: selectedColor ?? "white",
            p2_color: "white",
            background: selectedBackgroundImg,
            p1_alias: loggedUserData.username ?? 'Host',
            p2_alias: "Waiting for player 2."
        };
        sessionStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        
        container.innerHTML = "";
        const waitingMsg = document.createElement("h2");
        waitingMsg.id = 'waiting-text';
        waitingMsg.textContent = i18next.t("connecting_creating_game");
        waitingMsg.className = "text-white text-center font-orbitron font-bold text-xl animate-pulse";
        container.appendChild(waitingMsg);

        connectWebSocket(handleServerMessage);

        setTimeout(() => {
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

async function buildGuestPage(): Promise <void> {
    const loggedUserData = await loadUserProfile();
    let selectedColor: string | null = "white";
    let matchId: string = "";
    const container = document.createElement("div");

    container.className = "flex flex-col items-center justify-center h-screen space-y-10";
    renderPage(container);

    const title = document.createElement("h1");
    title.textContent = i18next.t("join_game");
    title.className = "text-white font-orbitron font-bold text-4xl mb-8";
    container.appendChild(title);

    const box = document.createElement("div");
    box.className = "flex flex-col items-center bg-black/50 border border-[#00F0FF] rounded px-10 py-8";
    container.appendChild(box);
    const inputWrapper = document.createElement("div");
    inputWrapper.className = "flex flex-col items-center mb-6";
    box.appendChild(inputWrapper);
    const matchLabel = document.createElement("label");
    matchLabel.textContent = i18next.t("enter_match_id");
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
    colorWrapper.appendChild(ColorSelector(onSelectColor));
    const joinBtn = document.createElement("button");
    joinBtn.id = 'join-btn';
    joinBtn.textContent = i18next.t("join_match");
    joinBtn.className = "mt-6 px-6 py-2 bg-blue-600 text-white font-orbitron font-bold rounded hover:bg-blue-700 transition";
    box.appendChild(joinBtn);

    joinBtn.addEventListener("click", () => {
        if (!matchId.trim()) {
            alert(i18next.t("enter_match_id_alert"));
            return;
        }
        joinBtn.disabled = true;

        const gameSettings = {
            p1_color: "white",
            p2_color: selectedColor ?? "white",
            background: "/images/backgroundGame/back10.jpg",
            p1_alias: "Host",
            p2_alias: loggedUserData.username ?? "Guest"
        };
        sessionStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        
        connectWebSocket(handleServerMessage);

        setTimeout(() => {
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
    const container = document.createElement("div");
    container.className = "flex items-center justify-center w-full h-full gap-6";
    const cards = [
        { title: i18next.t("host"), imgSrc: "/images/remoteGame/host.jpeg", action: buildHostPage },
        { title: i18next.t("guest"), imgSrc: "/images/remoteGame/guest.jpeg", action: buildGuestPage },
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
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-screen";
    renderPage(container);
    container.appendChild(createRemoteGameUI());
}