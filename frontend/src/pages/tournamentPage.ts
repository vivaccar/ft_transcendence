import { renderPage } from "../utils";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";
import { buildHumanGameLocal } from "../game/localPong/Pong";

// Função auxiliar para criar a UI de configuração para cada jogador
// Isso evita a repetição de código
function createPlayerSetupUI(
    playerNumber: number,
    onNameChange: (name: string) => void,
    onColorChange: (color: string) => void
): HTMLElement {
    const playerWrapper = document.createElement("div");
    playerWrapper.className = "flex flex-col items-center gap-3";

    const playerTitle = document.createElement("h2");
    playerTitle.textContent = `Player ${playerNumber}`;
    playerTitle.className = "text-white font-orbitron font-bold text-xl";
    playerWrapper.appendChild(playerTitle);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Digite seu nome";
    nameInput.className = "bg-gray-800 text-white text-center rounded-md p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500";
    nameInput.maxLength = 10;
    nameInput.addEventListener("input", (e) => {
        onNameChange((e.target as HTMLInputElement).value);
    });
    playerWrapper.appendChild(nameInput);
    
    playerWrapper.appendChild(ColorSelector(onColorChange));

    return playerWrapper;
}


export function buildTournamentsPage(gameType: string) {
    // Estado para armazenar as escolhas dos 4 jogadores
    let selectedbackgroundImg = "/images/backgroundGame/back10.jpg";
    const playersData = {
        p1: { name: "", color: "white" },
        p2: { name: "", color: "white" },
        p3: { name: "", color: "white" },
        p4: { name: "", color: "white" },
    };

    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-center h-[calc(100vh-64px)] py-10";
    renderPage(container);

    const title = document.createElement("h1");
    title.textContent = `Tournament Setup`;
    title.className = "text-white font-orbitron font-bold text-5xl mb-6";
    container.appendChild(title);
    
    // --- SELEÇÃO DE BACKGROUND ---
    const onSelectBackground = (background: string) => {
        selectedbackgroundImg = background;
    };
    const carousel = BackgroundCarousel(onSelectBackground);
    container.appendChild(carousel);

    // --- CONTAINER PARA OS 4 JOGADORES ---
    const playersContainer = document.createElement("div");
    playersContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8";
    
    // --- CONFIGURAÇÃO DE CADA JOGADOR ---
    const player1Setup = createPlayerSetupUI(1, 
        (name) => { playersData.p1.name = name; },
        (color) => { playersData.p1.color = color; }
    );
    
    const player2Setup = createPlayerSetupUI(2,
        (name) => { playersData.p2.name = name; },
        (color) => { playersData.p2.color = color; }
    );

    const player3Setup = createPlayerSetupUI(3,
        (name) => { playersData.p3.name = name; },
        (color) => { playersData.p3.color = color; }
    );

    const player4Setup = createPlayerSetupUI(4,
        (name) => { playersData.p4.name = name; },
        (color) => { playersData.p4.color = color; }
    );

    playersContainer.appendChild(player1Setup);
    playersContainer.appendChild(player2Setup);
    playersContainer.appendChild(player3Setup);
    playersContainer.appendChild(player4Setup);
    container.appendChild(playersContainer);

    // --- BOTÃO DE INICIAR TORNEIO ---
    const startBtn = document.createElement("button");
    startBtn.textContent = "Start Tournament";
    startBtn.className = "mt-10 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-2xl";
    
    startBtn.addEventListener("click", () => {
        // Guarda os dados de TODOS os jogadores para usar depois
        for (let i = 1; i <= 4; i++) {
            const pKey = `p${i}` as keyof typeof playersData;
            // Usa "Player X" se o nome estiver vazio
            const playerName = playersData[pKey].name.trim() === '' ? `Player ${i}` : playersData[pKey].name;
            
            sessionStorage.setItem(`tournament_p${i}_name`, playerName);
            sessionStorage.setItem(`tournament_p${i}_color`, playersData[pKey].color);
        }

        // Configura a SESSÃO para o PRIMEIRO JOGO (Player 1 vs Player 2)
        sessionStorage.setItem("playerName1", sessionStorage.getItem('tournament_p1_name')!);
        sessionStorage.setItem("selectedColorP1", sessionStorage.getItem('tournament_p1_color')!);
        sessionStorage.setItem("playerName2", sessionStorage.getItem('tournament_p2_name')!);
        sessionStorage.setItem("selectedColorP2", sessionStorage.getItem('tournament_p2_color')!);
        
        sessionStorage.setItem("selectedBackground", selectedbackgroundImg);
        // Indica que estamos em modo torneio para a lógica futura
        sessionStorage.setItem("gameMode", "tournament_semi_1");

        // Inicia o primeiro jogo do torneio
        buildHumanGameLocal(`${gameType}`, "default");
    });
    container.appendChild(startBtn);
}