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
    container.className = "flex items-center justify-center w-screen h-screen gap-6";

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
	totalText.style.textAlign = "center";
	totalText.style.fontWeight = "bold";
	totalText.style.marginTop = "24px";
	personalNbrBox.appendChild(totalText);

	// Barra de vitória/derrota
	const progressBar = document.createElement("div");
	progressBar.style.display = "flex";
	progressBar.style.height = "30px";
	progressBar.style.borderRadius = "8px";
	progressBar.style.overflow = "hidden";
	progressBar.style.margin = "32px 16px 4px 16px";

	const winBar = document.createElement("div");
	winBar.style.width = `${winPercent}%`;
	winBar.style.backgroundColor = "#2ecc71";
	winBar.style.display = "flex";
	winBar.style.justifyContent = "center";
	winBar.style.alignItems = "center";
	winBar.style.color = "white";

	const lossBar = document.createElement("div");
	lossBar.style.width = `${lossPercent}%`;
	lossBar.style.backgroundColor = "#e74c3c"; 
	lossBar.style.display = "flex";
	lossBar.style.justifyContent = "center";
	lossBar.style.alignItems = "center";
	lossBar.style.color = "white";

	progressBar.appendChild(winBar);
	progressBar.appendChild(lossBar);
	personalNbrBox.appendChild(progressBar);

	// Porcentagem abaixo da barra
	const percentLabel = document.createElement("p");
	percentLabel.textContent = `${winPercent.toFixed(0)}% Victories`;
	percentLabel.style.textAlign = "center";
	percentLabel.style.fontWeight = "bold";
	percentLabel.style.margin = "0 0 16px 0";
	
	personalNbrBox.appendChild(percentLabel);

	const columnsContainer = document.createElement("div");
	columnsContainer.style.display = "flex";
	columnsContainer.style.justifyContent = "center";
	columnsContainer.style.gap = "16px";
	columnsContainer.style.marginTop = "32px";

	// Coluna de vitórias
	const winsColumn = document.createElement("div");
	winsColumn.style.display = "flex";
	winsColumn.style.flexDirection = "column";
	winsColumn.style.alignItems = "center";

	const winsBox = document.createElement("div");
	winsBox.style.width = "60px";
	winsBox.style.height = "40px";
	winsBox.style.backgroundColor = "#2ecc71";
	winsBox.style.display = "flex";
	winsBox.style.justifyContent = "center";
	winsBox.style.alignItems = "center";
	winsBox.style.borderRadius = "8px";
	winsBox.style.fontWeight = "bold";
	winsBox.style.color = "white";
	winsBox.textContent = `${stats.wins}`;

	const winsLabel = document.createElement("p");
	winsLabel.textContent = "Wins";
	winsLabel.style.marginTop = "8px";
	winsLabel.style.fontWeight = "bold";

	winsColumn.appendChild(winsBox);
	winsColumn.appendChild(winsLabel);

	// Coluna de derrotas
	const lossesColumn = document.createElement("div");
	lossesColumn.style.display = "flex";
	lossesColumn.style.flexDirection = "column";
	lossesColumn.style.alignItems = "center";

	const lossesBox = document.createElement("div");
	lossesBox.style.width = "60px";
	lossesBox.style.height = "40px";
	lossesBox.style.backgroundColor = "#e74c3c";
	lossesBox.style.display = "flex";
	lossesBox.style.justifyContent = "center";
	lossesBox.style.alignItems = "center";
	lossesBox.style.borderRadius = "8px";
	lossesBox.style.fontWeight = "bold";
	lossesBox.style.color = "white";
	lossesBox.textContent = `${stats.losses}`;

	const lossesLabel = document.createElement("p");
	lossesLabel.textContent = "Losses";
	lossesLabel.style.marginTop = "8px";
	lossesLabel.style.fontWeight = "bold";

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

    games.forEach(game => {
        const row = document.createElement("tr");

        const resultCell = document.createElement("td");
        resultCell.textContent = game.result;
        resultCell.style.padding = "12px";
        resultCell.style.textAlign = "center";
        resultCell.style.color = game.result === "Win" ? "#2ecc71" : "#e74c3c";
        resultCell.style.fontWeight = "bold";

        const matchCell = document.createElement("td");
        matchCell.textContent = `You ${game.you} x ${game.friend} ${game.friendName}`;
        matchCell.style.padding = "12px";
        matchCell.style.textAlign = "center";

        row.appendChild(resultCell);
        row.appendChild(matchCell);
        lastGamesTable.appendChild(row);
    });

    lastGamesBox.appendChild(lastGamesTable);

    container.appendChild(lastGamesBox);
    container.appendChild(personalNbrBox);

    return { container };
}