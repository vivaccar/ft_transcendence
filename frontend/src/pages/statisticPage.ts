import { renderPage } from "../utils";

export function buildStatisticsPage(): void {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const statisticsUI = createStatisticsUI();

	container.appendChild(statisticsUI.container);
}

function createStatisticsUI(): {container: HTMLDivElement} {
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

	// exemplo, depois vai mudar para a logica do backend
	const stats = { wins: 7, losses: 3 };
	const total = stats.wins + stats.losses;
	const winPercent = (stats.wins / total) * 100;
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

    const lgheaderBar = document.createElement("div");
	lgheaderBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center sticky top-0 z-10";

	// Título Last Games
	const lastGametitle = document.createElement("h1");
	lastGametitle.textContent = "Last Games";
	lastGametitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";


    lgheaderBar.appendChild(lastGametitle);
    lastGamesBox.insertBefore(lgheaderBar, lastGamesBox.firstChild);

    const lastGamesTable = document.createElement("table");
    lastGamesTable.style.width = "100%";
    lastGamesTable.style.borderCollapse = "collapse";

    const games = [
        { result: "Win", you: 3, friend: 0, friendName: "Alice" },
        { result: "Loss", you: 1, friend: 2, friendName: "Bob" },
        { result: "Win", you: 2, friend: 1, friendName: "Charlie" },
		{ result: "Win", you: 3, friend: 0, friendName: "Alice" },
        { result: "Loss", you: 1, friend: 2, friendName: "Bob" },
        { result: "Win", you: 2, friend: 1, friendName: "Charlie" },
		{ result: "Win", you: 3, friend: 0, friendName: "Alice" },
        { result: "Loss", you: 1, friend: 2, friendName: "Bob" },
        { result: "Win", you: 2, friend: 1, friendName: "Charlie" },
		{ result: "Win", you: 3, friend: 0, friendName: "Alice" },
        { result: "Loss", you: 1, friend: 2, friendName: "Bob" },
        { result: "Win", you: 2, friend: 1, friendName: "Charlie" },
		{ result: "Win", you: 3, friend: 0, friendName: "Alice" },
        { result: "Loss", you: 1, friend: 2, friendName: "Bob" },
        { result: "Win", you: 2, friend: 1, friendName: "Charlie" },
		{ result: "Win", you: 3, friend: 0, friendName: "Alice" },
        { result: "Loss", you: 1, friend: 2, friendName: "Bob" },
        { result: "Win", you: 2, friend: 1, friendName: "Charlie" },
    ];

	games.forEach((game) => {
		const row = document.createElement("tr");
	  
		const resultCell = document.createElement("td");
		resultCell.textContent = game.result.toUpperCase();
		resultCell.className = `px-3 py-2 text-center font-orbitron font-bold ${
		  game.result === "Win" ? "text-[#2ecc71]" : "text-[#e74c3c]"
		}`;
	  
		const matchCell = document.createElement("td");
		matchCell.textContent = `You ${game.you} x ${game.friend} ${game.friendName}`;
		matchCell.className = "px-3 py-2 text-center font-orbitron font-bold";
	  
		row.appendChild(resultCell);
		row.appendChild(matchCell);
		lastGamesTable.appendChild(row);
	  });

    lastGamesBox.appendChild(lastGamesTable);

    container.appendChild(lastGamesBox);
    container.appendChild(personalNbrBox);

    return { container };
}