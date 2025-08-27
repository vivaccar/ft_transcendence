import { renderPage } from "../utils";
import { getMatches, getUserStats } from "../logic/statisticLogic";
import type { Game } from "../types";

export async function buildStatisticsPage(): Promise<void> {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const statisticsUI = await createStatisticsUI();

	container.appendChild(statisticsUI.container);
}

async function createStatisticsUI(): Promise<{ container: HTMLDivElement }> {
    const container = document.createElement("div");
    container.className = "flex items-center justify-center w-screen h-[calc(100vh-64px)] gap-6";

    // ---------------- Personal Numbers ----------------
    const personalNbrBox = document.createElement("div");
	personalNbrBox.className = "bg-white text-gray-900 rounded-xl shadow-lg w-full h-2/3 max-w-lg";
	personalNbrBox.style.background = "#D9D9D9";

	const pnheaderBar = document.createElement("div");
	pnheaderBar.className =
	  "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center";

	const personalNbrTitle = document.createElement("h1");
	personalNbrTitle.textContent = "Personal Numbers";
	personalNbrTitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";

	pnheaderBar.appendChild(personalNbrTitle);
	personalNbrBox.insertBefore(pnheaderBar, personalNbrBox.firstChild);

	const stats = await getUserStats();
	const total = stats.wins + stats.losses;
	const winPercent = total > 0 ? (stats.wins / total) * 100 : 0;
	const lossPercent = 100 - winPercent;

	// Texto mostrando total de partidas
	const totalText = document.createElement("p");
	totalText.textContent = `Total games: ${total}`;
	totalText.className = "text-center font-orbitron font-bold mt-6";

	personalNbrBox.appendChild(totalText);

	// Barra de vitória/derrota
	const progressBar = document.createElement("div");
	progressBar.className = "flex h-[30px] rounded-lg overflow-hidden mt-8 mx-4 mb-1";

	// Win bar
	const winBar = document.createElement("div");
	winBar.style.width = `${winPercent}%`;
	winBar.className = "flex justify-center items-center text-white bg-[#2ecc71]";

	// Loss bar
	const lossBar = document.createElement("div");
	lossBar.style.width = `${lossPercent}%`;
	lossBar.className = "flex justify-center items-center text-white bg-[#e74c3c]";

	progressBar.appendChild(winBar);
	progressBar.appendChild(lossBar);
	personalNbrBox.appendChild(progressBar);

	// Percent label
	const percentLabel = document.createElement("p");
	percentLabel.textContent = `${winPercent.toFixed(0)}% Victories`;
	percentLabel.className = "text-center font-orbitron font-bold mb-4";
	personalNbrBox.appendChild(percentLabel);

	// Columns container
	const columnsContainer = document.createElement("div");
	columnsContainer.className = "flex justify-center gap-4 mt-8";

	// Coluna de vitórias
	const winsColumn = document.createElement("div");
	winsColumn.className = "flex flex-col items-center";

	const winsBox = document.createElement("div");
	winsBox.style.width = "60px";
	winsBox.style.height = "40px";
	winsBox.textContent = `${stats.wins}`;
	winsBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#2ecc71]";

	const winsLabel = document.createElement("p");
	winsLabel.textContent = "Wins";
	winsLabel.className = "mt-2 font-orbitron font-bold";

	winsColumn.appendChild(winsBox);
	winsColumn.appendChild(winsLabel);

	// Coluna de derrotas
	const lossesColumn = document.createElement("div");
	lossesColumn.className = "flex flex-col items-center";

	const lossesBox = document.createElement("div");
	lossesBox.style.width = "60px";
	lossesBox.style.height = "40px";
	lossesBox.textContent = `${stats.losses}`;
	lossesBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#e74c3c]";

	const lossesLabel = document.createElement("p");
	lossesLabel.textContent = "Losses";
	lossesLabel.className = "mt-2 font-orbitron font-bold";

	lossesColumn.appendChild(lossesBox);
	lossesColumn.appendChild(lossesLabel);

	columnsContainer.appendChild(winsColumn);
	columnsContainer.appendChild(lossesColumn);

	personalNbrBox.appendChild(columnsContainer);

    // ---------------- Last Games ----------------
	const lastGamesBox = document.createElement("div");
	lastGamesBox.className = "bg-white text-gray-900 rounded-xl shadow-lg w-full h-2/3 max-w-2xl overflow-y-auto"; 
	lastGamesBox.style.background = "#D9D9D9";

	// Header 
	const lgheaderBar = document.createElement("div");
	lgheaderBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center sticky top-0 z-10 w-full";

	// Título Last Games
	const lastGametitle = document.createElement("h1");
	lastGametitle.textContent = "Last Games";
	lastGametitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";

	lgheaderBar.appendChild(lastGametitle);
	lastGamesBox.appendChild(lgheaderBar);

	// Container para os games
	const gamesContainer = document.createElement("div");
	gamesContainer.className = "flex flex-col gap-4 p-4";

	// const games = [{ result: "Win", you: 3, friend: 0, friendName: "Amauri", dateTime: new Date().toISOString() },
		// { result: "Loss", you: 0, friend: 3, friendName: "Amauri", dateTime: new Date().toISOString() }
	// ]; //fake data

	const games: Game[] = await getMatches();

	function createGameModal(game: typeof games[0]) {
	    // Modal background
	    const modalBg = document.createElement("div");
	    modalBg.className =
	        "fixed inset-0 bg-black/50 flex justify-center items-center z-50";

	    // Modal container
	    const modal = document.createElement("div");
	    modal.className = "bg-white rounded-lg p-6 max-w-md w-full flex flex-col gap-4 shadow-lg";

	    const title = document.createElement("h2");
	    title.textContent = `Game vs ${game.friendName}`;
	    title.className = "text-xl font-orbitron font-bold";

	    const result = document.createElement("p");
	    result.textContent = `Result: ${game.result}`;
	    result.className = `font-orbitron font-bold ${game.result === "Win" ? "text-[#2ecc71]" : "text-[#e74c3c]"}`;

	    const score = document.createElement("p");
	    score.textContent = `Score: You ${game.you} x ${game.friend} ${game.friendName}`;
	    score.className = "text-gray-600 font-orbitron";

	    const date = document.createElement("p");
	    date.textContent = `Date: ${game.dateTime.toLocaleString("pt-PT", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		  })}`;
	    date.className = "text-gray-600 font-orbitron";

		const touches = document.createElement("p");
	    touches.textContent = `Touches: You 6 x 3 ${game.friendName}`; //fake data
	    touches.className = "text-gray-600 font-orbitron";

	    const closeBtn = document.createElement("button");
	    closeBtn.textContent = "Close";
	    closeBtn.className = "mt-4 px-4 py-2 bg-[#174B7A] text-white font-orbitron rounded hover:bg-[#133A58] self-end";
	    closeBtn.addEventListener("click", () => {
	        modalBg.remove();
	    });

	    modal.appendChild(title);
	    modal.appendChild(result);
	    modal.appendChild(score);
	    modal.appendChild(touches);
	    modal.appendChild(date);
	    modal.appendChild(closeBtn);
	    modalBg.appendChild(modal);

	    document.body.appendChild(modalBg);
	}

	games.forEach((game) => {
	    const gameRow = document.createElement("button");
	    gameRow.className = "flex items-center justify-between bg-gray-100 rounded-lg shadow px-4 py-4 w-full text-left hover:bg-gray-200 transition";
	
	    const info = document.createElement("div");
	    info.className = "flex gap-12 justify-between items-center";

	    const result = document.createElement("span");
	    result.textContent = game.result.toUpperCase();
	    result.className = `font-orbitron font-bold ${game.result === "Win" ? "text-[#2ecc71]" : "text-[#e74c3c]"}`;

	    const match = document.createElement("span");
	    match.textContent = `You x ${game.friendName}`;
	    match.className = "font-orbitron";

	    info.appendChild(result);
	    info.appendChild(match);

	    gameRow.appendChild(info);

	    gameRow.addEventListener("click", () => createGameModal(game));

	    gamesContainer.appendChild(gameRow);
	});

	lastGamesBox.appendChild(gamesContainer);

    container.appendChild(lastGamesBox);
    container.appendChild(personalNbrBox);

    return { container };
}