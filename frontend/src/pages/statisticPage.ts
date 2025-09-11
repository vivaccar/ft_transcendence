import { renderPage } from "../utils";
import { getMatches, getUserStats, getUserGoals } from "../logic/statisticLogic";
import type { Game } from "../types";
import i18next from "i18next";

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
	personalNbrBox.className = "bg-white text-gray-900 rounded-xl shadow-lg w-full h-2/3 max-w-lg overflow-y-auto";
	personalNbrBox.style.background = "#D9D9D9";

	const pnheaderBar = document.createElement("div");
	pnheaderBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center sticky top-0 z-10 w-full";

	const personalNbrTitle = document.createElement("h1");
	personalNbrTitle.textContent = i18next.t('personal_numbers');
	personalNbrTitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";

	pnheaderBar.appendChild(personalNbrTitle);
	personalNbrBox.insertBefore(pnheaderBar, personalNbrBox.firstChild);
	
	const username = sessionStorage.getItem('username');
	const stats = await getUserStats(username);
	const total = stats.wins + stats.losses;
	const winPercent = total > 0 ? (stats.wins / total) * 100 : 0;
	const lossPercent = 100 - winPercent;

	// Texto mostrando total de partidas
	const totalText = document.createElement("p");
	totalText.textContent = i18next.t('games').toUpperCase();
	totalText.className = "text-center font-orbitron font-bold mt-2 text-2xl";

	personalNbrBox.appendChild(totalText);
	
	// Percent label
	const percentLabel = document.createElement("p");
	percentLabel.textContent = `${i18next.t('winning_percentage')}: ${winPercent.toFixed(0)}%`;
	percentLabel.className = "text-center font-orbitron font-bold";
	personalNbrBox.appendChild(percentLabel);

	// Barra de vitória/derrota
	const progressBar = document.createElement("div");
	progressBar.className = "flex h-[30px] rounded-lg overflow-hidden mt-2 mx-4 mb-1";

	// Win bar
	const winBar = document.createElement("div");
	winBar.style.width = `${winPercent}%`;
	winBar.className = "flex justify-center items-center text-white bg-[#A66DD4]";

	// Loss bar
	const lossBar = document.createElement("div");
	lossBar.style.width = `${lossPercent}%`;
	lossBar.className = "flex justify-center items-center text-white bg-[#362A63]";

	progressBar.appendChild(winBar);
	progressBar.appendChild(lossBar);
	personalNbrBox.appendChild(progressBar);


	// Columns container
	const columnsContainer = document.createElement("div");
	columnsContainer.className = "flex justify-center gap-4 mt-4";

	// Coluna de vitórias
	const winsColumn = document.createElement("div");
	winsColumn.className = "flex flex-col items-center";

	const winsBox = document.createElement("div");
	winsBox.style.width = "60px";
	winsBox.style.height = "40px";
	winsBox.textContent = `${stats.wins}`;
	winsBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#A66DD4]";

	const winsLabel = document.createElement("p");
	winsLabel.textContent = i18next.t("wins");
	winsLabel.className = "mt-1 font-orbitron font-bold";

	winsColumn.appendChild(winsBox);
	winsColumn.appendChild(winsLabel);

	// Coluna de derrotas
	const lossesColumn = document.createElement("div");
	lossesColumn.className = "flex flex-col items-center";

	const lossesBox = document.createElement("div");
	lossesBox.style.width = "60px";
	lossesBox.style.height = "40px";
	lossesBox.textContent = `${stats.losses}`;
	lossesBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#362A63]";

	const lossesLabel = document.createElement("p");
	lossesLabel.textContent = i18next.t("losses");
	lossesLabel.className = "mt-1 font-orbitron font-bold";

	lossesColumn.appendChild(lossesBox);
	lossesColumn.appendChild(lossesLabel);

	columnsContainer.appendChild(winsColumn);
	columnsContainer.appendChild(lossesColumn);

	personalNbrBox.appendChild(columnsContainer);

	// POINTS 
	const goals = await getUserGoals(username);
	const totalGoals = goals.goalsPro + goals.goalsCon;
	const goalsProPercent = total > 0 ? (goals.goalsPro / totalGoals) * 100 : 0;
	const goalsConPercent = 100 - goalsProPercent;

	const totalGoalsText = document.createElement("p");
	totalGoalsText.textContent = i18next.t('points').toUpperCase();
	totalGoalsText.className = "text-center font-orbitron font-bold mt-6 text-2xl";

	personalNbrBox.appendChild(totalGoalsText);

	// Barra de pontos feitos/concedidos
	const progressGoalsBar = document.createElement("div");
	progressGoalsBar.className = "flex h-[30px] rounded-lg overflow-hidden mt-2 mx-4 mb-1";

	// goals pro bar
	const goalsProBar = document.createElement("div");
	goalsProBar.style.width = `${goalsProPercent}%`;
	goalsProBar.className = "flex justify-center items-center text-white bg-[#A66DD4]";

	// goals con bar
	const goalsConBar = document.createElement("div");
	goalsConBar.style.width = `${goalsConPercent}%`;
	goalsConBar.className = "flex justify-center items-center text-white bg-[#362A63]";

	progressGoalsBar.appendChild(goalsProBar);
	progressGoalsBar.appendChild(goalsConBar);
	personalNbrBox.appendChild(progressGoalsBar);
 
	
	// Columns container
	const columnsContainerGoals = document.createElement("div");
	columnsContainerGoals.className = "flex justify-center gap-4 mt-4";

	// Coluna de goals pro
	const goalsProColumn = document.createElement("div");
	goalsProColumn.className = "flex flex-col items-center";

	const goalsProBox = document.createElement("div");
	goalsProBox.style.width = "60px";
	goalsProBox.style.height = "40px";
	goalsProBox.textContent = `${goals.goalsPro}`;
	goalsProBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#A66DD4]";

	const goalsProLabel = document.createElement("p");
	goalsProLabel.textContent = i18next.t("scored");
	goalsProLabel.className = "mt-2 font-orbitron font-bold";

	goalsProColumn.appendChild(goalsProBox);
	goalsProColumn.appendChild(goalsProLabel);

	// Coluna de goals con
	const goalsConColumn = document.createElement("div");
	goalsConColumn.className = "flex flex-col items-center";

	const goalsConBox = document.createElement("div");
	goalsConBox.style.width = "60px";
	goalsConBox.style.height = "40px";
	goalsConBox.textContent = `${goals.goalsCon}`;
	goalsConBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#362A63]";

	const goalsConLabel = document.createElement("p");
	goalsConLabel.textContent = i18next.t("conceded");
	goalsConLabel.className = "mt-2 font-orbitron font-bold";

	goalsConColumn.appendChild(goalsConBox);
	goalsConColumn.appendChild(goalsConLabel);

	columnsContainerGoals.appendChild(goalsProColumn);
	columnsContainerGoals.appendChild(goalsConColumn);

	personalNbrBox.appendChild(columnsContainerGoals)

    // ---------------- Last Games ----------------
	const lastGamesBox = document.createElement("div");
	lastGamesBox.className = "bg-white text-gray-900 rounded-xl shadow-lg w-full h-2/3 max-w-2xl overflow-y-auto"; 
	lastGamesBox.style.background = "#D9D9D9";

	// Header 
	const lgheaderBar = document.createElement("div");
	lgheaderBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center sticky top-0 z-10 w-full";

	// Título Last Games
	const lastGametitle = document.createElement("h1");
	lastGametitle.textContent = i18next.t("last_games");
	lastGametitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";

	lgheaderBar.appendChild(lastGametitle);
	lastGamesBox.appendChild(lgheaderBar);

	// Container para os games
	const gamesContainer = document.createElement("div");
	gamesContainer.className = "flex flex-col gap-4 p-4";

	const games: Game[] = await getMatches(username);

	function createGameModal(game: typeof games[0]) {
	    // Modal background
	    const modalBg = document.createElement("div");
	    modalBg.className =
	        "fixed inset-0 bg-black/50 flex justify-center items-center z-50";

	    // Modal container
	    const modal = document.createElement("div");
	    modal.className = "bg-white rounded-lg p-6 max-w-md w-full flex flex-col gap-4 shadow-lg";

	    const titleWrapper = document.createElement("div");
		titleWrapper.className = "flex justify-center items-center gap-4 text-xl font-orbitron font-bold";

		const youBox = document.createElement("div");
		youBox.textContent = game.youName;
		youBox.className = "bg-[#A66DD4] text-white px-4 py-2 rounded-lg shadow";

		const vsText = document.createElement("span");
		vsText.textContent = "vs";
		vsText.className = "text-black";

		const friendBox = document.createElement("div");
		friendBox.textContent = game.friendName;
		friendBox.className = "bg-[#362A63] text-white px-4 py-2 rounded-lg shadow";

		titleWrapper.appendChild(youBox);
		titleWrapper.appendChild(vsText);
		titleWrapper.appendChild(friendBox);

		modal.appendChild(titleWrapper);
		
	    const score = document.createElement("p");
	    score.textContent = `${i18next.t('score')}`;
	    score.className = "flex justify-center font-bold text-gray-600 font-orbitron";
		
	    const date = document.createElement("p");
	    date.textContent = `${game.dateTime.toLocaleString("pt-PT", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		})}`;
	    date.className = "flex justify-center font-bold text-gray-600 font-orbitron";

		const goalsWrapper = document.createElement("div");
		goalsWrapper.className = "w-full flex items-center justify-between gap-2";

		const goalsUserBox = document.createElement("div");
		goalsUserBox.textContent = game.you.toString();
		goalsUserBox.className = "bg-[#A66DD4] text-white font-bold rounded-full px-2 py-1 text-sm";

		const goalsBarContainer = document.createElement("div");
		goalsBarContainer.className = "flex-1 bg-gray-300 rounded h-6 overflow-hidden flex";

		const goalsUserPercent = total > 0 ? (game.you / (game.you + game.friend)) * 100 : 0;
		const goalsOpponentPercent = 100 - goalsUserPercent;

		const goalsUserBar = document.createElement("div");
		goalsUserBar.style.width = `${goalsUserPercent}%`;
		goalsUserBar.className = "bg-[#A66DD4] h-6";

		const goalsOpponentBar = document.createElement("div");
		goalsOpponentBar.style.width = `${goalsOpponentPercent}%`;
		goalsOpponentBar.className = "bg-[#362A63] h-6";

		goalsBarContainer.appendChild(goalsUserBar);
		goalsBarContainer.appendChild(goalsOpponentBar);

		const goalsFriendBox = document.createElement("div");
		goalsFriendBox.textContent = game.friend.toString();
		goalsFriendBox.className = "bg-[#362A63] text-white font-bold rounded-full px-2 py-1 text-sm";

		goalsWrapper.appendChild(goalsUserBox);
		goalsWrapper.appendChild(goalsBarContainer);
		goalsWrapper.appendChild(goalsFriendBox);
		
		const touches = document.createElement("p");
	    touches.textContent = `${i18next.t('touches')}`;
	    touches.className = "flex justify-center font-bold text-gray-600 font-orbitron";

		const touchesWrapper = document.createElement("div");
		touchesWrapper.className = "w-full flex items-center justify-between gap-2";

		const touchesUserBox = document.createElement("div");
		touchesUserBox.textContent = game.touchesUser.toString();
		touchesUserBox.className = "bg-[#A66DD4] text-white font-bold rounded-full px-2 py-1 text-sm";

		const touchesBarContainer = document.createElement("div");
		touchesBarContainer.className = "flex-1 bg-gray-300 rounded h-6 overflow-hidden flex";

		const touchesUserPercent = total > 0 ? (game.touchesUser / (game.touchesUser + game.touchesOpponent)) * 100 : 0;
		const touchesOpponentPercent = 100 - touchesUserPercent;

		const touchesUserBar = document.createElement("div");
		touchesUserBar.style.width = `${touchesUserPercent}%`;
		touchesUserBar.className = "bg-[#A66DD4] h-6";

		const touchesOpponentBar = document.createElement("div");
		touchesOpponentBar.style.width = `${touchesOpponentPercent}%`;
		touchesOpponentBar.className = "bg-[#362A63] h-6";

		touchesBarContainer.appendChild(touchesUserBar);
		touchesBarContainer.appendChild(touchesOpponentBar);

		const touchesFriendBox = document.createElement("div");
		touchesFriendBox.textContent = game.touchesOpponent.toString();
		touchesFriendBox.className = "bg-[#362A63] text-white font-bold rounded-full px-2 py-1 text-sm";

		touchesWrapper.appendChild(touchesUserBox);
		touchesWrapper.appendChild(touchesBarContainer);
		touchesWrapper.appendChild(touchesFriendBox);
		
	    const closeBtn = document.createElement("button");
	    closeBtn.textContent = i18next.t('close');
	    closeBtn.className = "mt-4 px-4 py-2 bg-[#174B7A] text-white font-orbitron rounded hover:bg-[#133A58] self-end";
	    closeBtn.addEventListener("click", () => {
			modalBg.remove();
	    });
		
	    modal.appendChild(date);
	    modal.appendChild(score);
		modal.appendChild(goalsWrapper);
	    modal.appendChild(touches);
		modal.appendChild(touchesWrapper);
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
	    result.textContent = i18next.t(game.result.toLowerCase()).toUpperCase();
	    result.className = `font-orbitron font-bold ${game.result === "Win" ? "text-[#2ecc71]" : "text-[#e74c3c]"}`;

	    const match = document.createElement("span");
	    match.textContent = `${game.youName} x ${game.friendName}`;
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