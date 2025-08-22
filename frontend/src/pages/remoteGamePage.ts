import { renderPage } from "../utils";
import { navigate } from "../router";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { ColorSelector } from "../components/ColorSelector";

export function buildRemoteGamePage(): void {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const remoteGameUI = createRemoteGameUI();
	container.appendChild(remoteGameUI.container);

}

function createRemoteGameUI(): {container: HTMLDivElement} {
	const container = document.createElement("div");
    container.className = "flex items-center justify-center w-screen h-[calc(100vh-64px)] gap-6";

	const cards = [
		{ title: 'Host', imgSrc: '/images/remoteGame/host.jpeg', action: buildHostPage },
		{ title: 'Guest', imgSrc: '/images/remoteGame/guest.jpeg', action: buildGuestPage },
	];

	cards.forEach(({ title, imgSrc, action }) => {
			const card = document.createElement('a');
			card.className = 'relative w-80 h-3/4 overflow-hidden rounded border border-[#00F0FF]\
							cursor-pointer transform transition-transform duration-300 hover:scale-105'; 
			card.style.backgroundImage = `url(${imgSrc})`;
			card.style.backgroundSize = 'cover';
			card.style.backgroundPosition = 'center';
			card.href = "#";
	
			card.addEventListener("click", (e) => {
				e.preventDefault();
				action();
			});
		
			const titleDiv = document.createElement('div');
			titleDiv.className = 'absolute left-0 w-full bg-black bg-opacity-60 text-white text-center\
								 py-3 font-orbitron font-bold text-lg';
			titleDiv.style.backgroundColor = 'transparent';
			titleDiv.style.textShadow = 'none'; 
			titleDiv.textContent = title;
		
			container.appendChild(card);
			card.appendChild(titleDiv);
		  });

	return { container };
}

export function buildHostPage(): { container: HTMLDivElement } {
	let selectedColor: string | null = null;
	let selectedBackgroundImg = "/images/backgroundGame/back10.jpg";

	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen";
	renderPage(container);

	// Título
	const title = document.createElement("h1");
	title.textContent = "Remote Game";
	title.className = "text-white font-orbitron font-bold text-4xl mb-8";
	container.appendChild(title);

	const subtitle = document.createElement("h2");
	subtitle.textContent = "Host Setup";
	subtitle.className = "text-white font-orbitron text-2xl mb-8";
	container.appendChild(subtitle);

	// Background selector
	const onSelectBackground = (bg: string) => {
		selectedBackgroundImg = bg;
	};
	const carousel = BackgroundCarousel(onSelectBackground);
	container.appendChild(carousel);

	// Color selector
	const onSelectColor = (color: string) => {
		selectedColor = color;
	};
	const colorWrapper = document.createElement("div");
	colorWrapper.className = "flex flex-col items-center mt-6";
	const colorTitle = document.createElement("h2");
	colorTitle.textContent = "Your Paddle Color";
	colorTitle.className = "text-white font-orbitron font-bold mb-2";
	colorWrapper.appendChild(colorTitle);
	colorWrapper.appendChild(ColorSelector(onSelectColor));
	container.appendChild(colorWrapper);

	// Botão continuar
	const startBtn = document.createElement("button");
	startBtn.textContent = "Continue";
	startBtn.className =
		"mt-6 px-6 py-2 bg-green-600 text-white font-orbitron font-bold rounded hover:bg-green-700 transition";
	startBtn.addEventListener("click", () => {
		// salva escolhas
		sessionStorage.setItem("hostColor", selectedColor ?? "white");
		sessionStorage.setItem("selectedBackground", selectedBackgroundImg);

		// Limpa tela e mostra "esperando"
		container.innerHTML = "";
		const waitingMsg = document.createElement("h2");
		waitingMsg.textContent = "Waiting for Guest to join...";
		waitingMsg.className =
			"text-white font-orbitron font-bold text-3xl animate-pulse";
			container.appendChild(waitingMsg);
	});
	container.appendChild(startBtn);

	return { container };
}

export function buildGuestPage(): { container: HTMLDivElement } {
	let selectedColor: string | null = null;
	let matchId: string = "";

	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen space-y-10";
	renderPage(container);

	// Título (fora da caixa)
	const title = document.createElement("h1");
	title.textContent = "Remote Game";
	title.className = "text-white font-orbitron font-bold text-4xl mb-8";
	container.appendChild(title);

	// Caixa que engloba tudo (Match ID + Color + Botão)
	const box = document.createElement("div");
	box.className =
		"flex flex-col items-center bg-black/50 border border-[#00F0FF] rounded px-10 py-8";

	// Subtitle
	const subtitle = document.createElement("h2");
	subtitle.textContent = "Guest Setup";
	subtitle.className = "text-white font-orbitron text-2xl mb-6";
	box.appendChild(subtitle);

	// Match ID input
	const inputWrapper = document.createElement("div");
	inputWrapper.className = "flex flex-col items-center mb-6";

	const matchLabel = document.createElement("label");
	matchLabel.textContent = "Enter Match ID";
	matchLabel.className = "text-white font-orbitron font-bold mb-2";
	inputWrapper.appendChild(matchLabel);

	const matchInput = document.createElement("input");
	matchInput.type = "text";
	matchInput.placeholder = "e.g. 12345";
	matchInput.className =
		"px-4 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500";
	matchInput.addEventListener("input", (e) => {
		matchId = (e.target as HTMLInputElement).value;
	});
	inputWrapper.appendChild(matchInput);

	box.appendChild(inputWrapper);

	// Color selector
	const onSelectColor = (color: string) => {
		selectedColor = color;
	};
	const colorWrapper = document.createElement("div");
	colorWrapper.className = "flex flex-col items-center mt-2";
	const colorTitle = document.createElement("h2");
	colorTitle.textContent = "Your Paddle Color";
	colorTitle.className = "text-white font-orbitron font-bold mb-2";
	colorWrapper.appendChild(colorTitle);
	colorWrapper.appendChild(ColorSelector(onSelectColor));
	box.appendChild(colorWrapper);

	// Botão join
	const joinBtn = document.createElement("button");
	joinBtn.textContent = "Join Match";
	joinBtn.className =
		"mt-6 px-6 py-2 bg-green-600 text-white font-orbitron font-bold rounded hover:bg-green-700 transition";
	joinBtn.addEventListener("click", () => {
		if (!matchId) {
			alert("Please enter a Match ID.");
			return;
		}

		sessionStorage.setItem("guestColor", selectedColor ?? "white");
		sessionStorage.setItem("matchId", matchId);

		// aqui pode ir para a tela de jogo remoto
		navigate("./game-remote");
	});
	box.appendChild(joinBtn);

	// adiciona a caixa dentro do container
	container.appendChild(box);

	return { container };
}
