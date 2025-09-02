import { renderPage } from "../utils";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";
import { GameModeSelector } from "../components/gameModeSelector";
// import { navigate } from "../router";
import { buildHumanGameLocal } from "../game/localPong/Pong";

export function buildGamePageManVsManLocal(gameType: string) {
	let selectedColorP1: string | null = null;
	let selectedColorP2: string | null = null;
  	let selectedbackgroundImg = "/images/backgroundGame/back10.jpg";
	let selectedGameMode: "default" | "special" = "default";

  	const container = document.createElement("div");
  	container.className = "flex flex-col items-center justify-center h-screen overflow-y-auto";
  	renderPage(container);

  	const title = document.createElement("h1");
	if (gameType == 'human') {
		title.textContent = `Human vs Human`;
	} else {
		title.textContent = `Human vs AI`;
	}
  	title.className = "text-white font-orbitron font-bold text-4xl mb-8";
  	container.appendChild(title);
	
	const subtitle = document.createElement("h2");
  	subtitle.textContent = 'Local';
  	subtitle.className = "text-white font-orbitron text-4xl mb-8";
  	container.appendChild(subtitle);

  	const onSelectBackground = (Background: string) => {
  	  selectedbackgroundImg = Background;
  	};

  	const carousel = BackgroundCarousel(onSelectBackground);
  	container.appendChild(carousel);

  	// Player 1
	const onSelectColorP1 = (color: string) => {
		selectedColorP1 = color;
  	};
  
	  
  	const playersContainer = document.createElement("div");
  	playersContainer.className = "flex gap-[5rem] mt-6";
	  
  	const player1Wrapper = document.createElement("div");
  	player1Wrapper.className = "flex flex-col items-center";
  	const player1Title = document.createElement("h2");
  	player1Title.textContent = "Player 1";
  	player1Title.className = "text-white font-orbitron font-bold mb-2";
  	player1Wrapper.appendChild(player1Title);
  	player1Wrapper.appendChild(ColorSelector(onSelectColorP1));
	  
  	playersContainer.appendChild(player1Wrapper);
	  
  	// Player 2
	if (gameType == 'human'){
		const onSelectColorP2 = (color: string) => {
		  selectedColorP2 = color;
		};
		const player2Wrapper = document.createElement("div");
		player2Wrapper.className = "flex flex-col items-center";
		const player2Title = document.createElement("h2");
		player2Title.textContent = "Player 2";
		player2Title.className = "text-white font-orbitron font-bold mb-2";
		player2Wrapper.appendChild(player2Title);
		player2Wrapper.appendChild(ColorSelector(onSelectColorP2));
		playersContainer.appendChild(player2Wrapper);
	}
	
  	container.appendChild(playersContainer);

    const modeSelector = GameModeSelector((mode) => {
        selectedGameMode = mode;
    }, "default");
    container.appendChild(modeSelector);

  	const startBtn = document.createElement("button");
  	startBtn.textContent = "Start";
  	startBtn.className =
  	  "mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition";
  	startBtn.addEventListener("click", () => {

  	sessionStorage.setItem("selectedColorP1", selectedColorP1 ?? "white");
    sessionStorage.setItem("selectedColorP2", selectedColorP2 ?? "white");
    sessionStorage.setItem("selectedBackground", selectedbackgroundImg);

    buildHumanGameLocal(`${gameType}`, selectedGameMode);
	
  });
  container.appendChild(startBtn);
}
