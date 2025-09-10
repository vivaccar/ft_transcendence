import { renderPage } from "../utils";
import { fetchFriendInvites, fetchUserAvatar, sendFriendInvite, acceptInvite, declineInvite, fetchFriends, unfriendUser } from "../logic/friendsLogic";
import i18next from "i18next";

export async function buildFriendsPage(): Promise<void> {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const friendsUI = await createFriendsUI();
	container.appendChild(friendsUI);
}

async function createFriendsUI(): Promise<HTMLDivElement> {
	const container = document.createElement("div");
	container.className = "flex items-center justify-center w-screen h-[calc(100vh-64px)] gap-6";

	// ---------------- Friends Box ----------------// 
	const friendsBox = document.createElement("div");
	friendsBox.className =
		"bg-[#D9D9D9] text-gray-900 rounded-xl shadow-lg h-2/3 flex-1 max-w-2xl flex flex-col";

	// Header
	const pnheaderBar = document.createElement("div");
	pnheaderBar.className =
		"bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-between items-center gap-4";

	// Search Input
	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.placeholder = i18next.t("search_friend");
	searchInput.className = "bg-gray-100 flex-1 px-3 py-2 rounded-md border-none outline-none";

	// Add Friend Button
	const addButton = document.createElement("button");
	addButton.textContent = i18next.t("add_friend");
	addButton.className =
		"bg-[#193D5E] text-white px-4 py-2 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-sky-950";


	addButton.addEventListener("click", () => {
		const friendName = searchInput.value.trim();
		if (!friendName) {
			alert(i18next.t("enter_friend_name"));
			return;
		}
		sendFriendInvite(friendName);
	});

	pnheaderBar.appendChild(searchInput);
	pnheaderBar.appendChild(addButton);

	// Lista de amigos (scrollável)
	const friendsList = document.createElement("div");
	friendsList.className =
		"flex-1 overflow-y-auto p-4 flex flex-col gap-4";

	const friends = await fetchFriends();

	for (const friend of friends) {
		const friendRow = document.createElement("div");
		friendRow.className =
			"flex items-center justify-between bg-gray-100 rounded-lg shadow px-4 py-2";

		// Foto + Nome + Status
		const info = document.createElement("div");
		info.className = "flex items-center gap-3";

		const avatar = document.createElement("img");
		avatar.src = await fetchUserAvatar(friend.friend);
		avatar.className = "w-10 h-10 object-cover rounded-full border border-gray-300";

		const nameStatus = document.createElement("div");
		nameStatus.className = "flex flex-col";

		const name = document.createElement("span");
		name.textContent = friend.friend;
		name.className = "font-orbitron";

		const online = Boolean(friend.isOnline);

		const status = document.createElement("span");
		status.className = `flex items-center text-sm ${
			online ? "text-green-600" : "text-red-600"
		}`;
		status.innerHTML = `<span class="w-2 h-2 rounded-full mr-1 ${
			online ? "bg-green-500" : "bg-red-500"
		}"></span>${online ? i18next.t("online") : i18next.t("offline")}`;

		nameStatus.appendChild(name);
		nameStatus.appendChild(status);

		info.appendChild(avatar);
		info.appendChild(nameStatus);

		// Botão Unfriend
		const unfriendBtn = document.createElement("button");
		unfriendBtn.textContent = i18next.t("unfriend");
		unfriendBtn.className =
			"bg-[#193D5E] text-white px-3 py-1 rounded-md text-sm font-orbitron font-semibold cursor-pointer hover:bg-red-700 transition-colors";

		unfriendBtn.addEventListener("click", async () => {
			const success = await unfriendUser(friend.friend);
			if (success) {
				friendRow.remove();
			}
		});
	
		friendRow.appendChild(info);
		friendRow.appendChild(unfriendBtn);

		// Botão See Profile
		const seeProfileBtn = document.createElement("button");
		seeProfileBtn.textContent = i18next.t("see_profile");
		seeProfileBtn.className =
			"bg-[#007bff] text-white px-3 py-1 rounded-md text-sm font-orbitron font-semibold cursor-pointer hover:bg-blue-700 transition-colors";

		seeProfileBtn.addEventListener("click", () => {
			createFriendModal(friend);
		});

		friendRow.appendChild(seeProfileBtn);

		friendsList.appendChild(friendRow);
	};

	friendsBox.appendChild(pnheaderBar);
	friendsBox.appendChild(friendsList);

	// ---------------- Friend Requests ----------------
	const requestsBox = document.createElement("div");
	requestsBox.className = 
		"bg-[#D9D9D9] text-gray-900 rounded-xl shadow-lg h-2/3 flex-[0.6] max-w-xl flex flex-col";

	// Header Requests
	const reqHeader = document.createElement("div");
	reqHeader.className =
	  "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center";

	const reqTitle = document.createElement("h1");
	reqTitle.textContent = i18next.t("friend_requests");
	reqTitle.className = "text-white py-2 text-xl font-orbitron font-bold mb-0 text-center";

	reqHeader.appendChild(reqTitle);

	// Requests List
	const requestsList = document.createElement("div");
	requestsList.className = "flex-1 overflow-y-auto p-4 flex flex-col gap-4";

	const requests = await fetchFriendInvites();

	for (const req of requests) {
		const reqRow = document.createElement("div");
		reqRow.className =
			"flex items-center justify-between bg-gray-100 rounded-lg shadow px-4 py-2";

		const info = document.createElement("div");
		info.className = "flex items-center gap-3";

		const avatar = document.createElement("img");
		avatar.src = await fetchUserAvatar(req.requester);
		avatar.className = "w-10 h-10 object-cover rounded-full border border-gray-300";

		const name = document.createElement("span");
		name.textContent = req.requester;
		name.className = "font-orbitron";

		info.appendChild(avatar);
		info.appendChild(name);

		// Botões
		const btnGroup = document.createElement("div");
		btnGroup.className = "flex gap-2";

		const acceptBtn = document.createElement("button");
		acceptBtn.textContent = i18next.t("accept");
		acceptBtn.className =
			"bg-green-600 text-white px-3 py-1 rounded-md text-sm font-orbitron font-semibold cursor-pointer hover:bg-green-700 transition-colors";

		const declineBtn = document.createElement("button");
		declineBtn.textContent = i18next.t("Decline");
		declineBtn.className =
			"bg-red-600 text-white px-3 py-1 rounded-md text-sm font-orbitron font-semibold cursor-pointer hover:bg-red-700 transition-colors";

		acceptBtn.addEventListener("click", async () => {
			const ok = await acceptInvite(req.requester);
			if (ok) {
				reqRow.remove();
			}
		});
		
		declineBtn.addEventListener("click", async () => {
			const ok = await declineInvite(req.requester);
			if (ok) {
				reqRow.remove();
			}
		});
		
		btnGroup.appendChild(acceptBtn);
		btnGroup.appendChild(declineBtn);

		reqRow.appendChild(info);
		reqRow.appendChild(btnGroup);

		requestsList.appendChild(reqRow);
	}

	requestsBox.appendChild(reqHeader);
	requestsBox.appendChild(requestsList);


	container.appendChild(friendsBox);
	container.appendChild(requestsBox);


	// Função para criar o modal do perfil do amigo
	async function createFriendModal(friend) {
		// Modal background
		const modalBg = document.createElement("div");
		modalBg.className = "fixed inset-0 bg-black/50 flex justify-center items-center z-50";

	// Modal container
	const modal = document.createElement("div");
	modal.className = "bg-white rounded-lg p-6 max-w-xl w-full flex flex-col gap-6 shadow-lg";

		// Avatar e nome (fallback se não existir)
		let avatarUrl = friend.avatar;
		let displayName = friend.name;
		if (!avatarUrl) {
			avatarUrl = await fetchUserAvatar(friend.friend || friend.name);
		}
		if (!displayName) {
			displayName = friend.friend || "";
		}

	// Top row: avatar centralizado, nome abaixo centralizado
	const topRow = document.createElement("div");
	topRow.className = "flex flex-col items-center justify-center mb-4";

	const avatar = document.createElement("img");
	avatar.src = avatarUrl;
	avatar.alt = "Avatar";
	avatar.className = "w-28 h-28 rounded-full border-4 border-[#174B7A] mx-auto mb-2";

	const name = document.createElement("h2");
	name.textContent = displayName;
	name.className = "text-4xl font-orbitron font-bold text-center mt-2";

	topRow.appendChild(avatar);
	topRow.appendChild(name);

	// Personal Numbers Box
	const personalNbrBox = document.createElement("div");
	personalNbrBox.className = "bg-[#D9D9D9] text-gray-900 rounded-xl shadow-lg w-full h-[220px] max-w-xs overflow-y-auto flex-1";

		const pnheaderBar = document.createElement("div");
		pnheaderBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center w-full";
		const personalNbrTitle = document.createElement("h1");
		personalNbrTitle.textContent = i18next.t('personal_numbers');
		personalNbrTitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";
		pnheaderBar.appendChild(personalNbrTitle);
		personalNbrBox.appendChild(pnheaderBar);

		// Estatísticas
		const stats = friend.stats || { wins: 0, losses: 0, goalsPro: 0, goalsCon: 0 };
		const total = stats.wins + stats.losses;
		const winPercent = total > 0 ? (stats.wins / total) * 100 : 0;
		const lossPercent = 100 - winPercent;

		const totalText = document.createElement("p");
		totalText.textContent = i18next.t('games').toUpperCase();
		totalText.className = "text-center font-orbitron font-bold mt-2 text-2xl";
		personalNbrBox.appendChild(totalText);

		const percentLabel = document.createElement("p");
		percentLabel.textContent = `${i18next.t('winning_percentage')}: ${winPercent.toFixed(0)}%`;
		percentLabel.className = "text-center font-orbitron font-bold";
		personalNbrBox.appendChild(percentLabel);

		const progressBar = document.createElement("div");
		progressBar.className = "flex h-[30px] rounded-lg overflow-hidden mt-2 mx-4 mb-1";
		const winBar = document.createElement("div");
		winBar.style.width = `${winPercent}%`;
		winBar.className = "flex justify-center items-center text-white bg-[#A66DD4]";
		const lossBar = document.createElement("div");
		lossBar.style.width = `${lossPercent}%`;
		lossBar.className = "flex justify-center items-center text-white bg-[#362A63]";
		progressBar.appendChild(winBar);
		progressBar.appendChild(lossBar);
		personalNbrBox.appendChild(progressBar);

		const columnsContainer = document.createElement("div");
		columnsContainer.className = "flex justify-center gap-4 mt-4";
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

		// Gols
		const totalGoalsText = document.createElement("p");
		totalGoalsText.textContent = i18next.t('goals').toUpperCase();
		totalGoalsText.className = "text-center font-orbitron font-bold mt-4 text-2xl";
		personalNbrBox.appendChild(totalGoalsText);

		const progressGoalsBar = document.createElement("div");
		progressGoalsBar.className = "flex h-[30px] rounded-lg overflow-hidden mt-2 mx-4 mb-1";
		const goalsTotal = stats.goalsPro + stats.goalsCon;
		const goalsProPercent = goalsTotal > 0 ? (stats.goalsPro / goalsTotal) * 100 : 0;
		const goalsConPercent = 100 - goalsProPercent;
		const goalsProBar = document.createElement("div");
		goalsProBar.style.width = `${goalsProPercent}%`;
		goalsProBar.className = "flex justify-center items-center text-white bg-[#A66DD4]";
		const goalsConBar = document.createElement("div");
		goalsConBar.style.width = `${goalsConPercent}%`;
		goalsConBar.className = "flex justify-center items-center text-white bg-[#362A63]";
		progressGoalsBar.appendChild(goalsProBar);
		progressGoalsBar.appendChild(goalsConBar);
		personalNbrBox.appendChild(progressGoalsBar);

		const columnsContainerGoals = document.createElement("div");
		columnsContainerGoals.className = "flex justify-center gap-4 mt-4";
		const goalsProColumn = document.createElement("div");
		goalsProColumn.className = "flex flex-col items-center";
		const goalsProBox = document.createElement("div");
		goalsProBox.style.width = "60px";
		goalsProBox.style.height = "40px";
		goalsProBox.textContent = `${stats.goalsPro}`;
		goalsProBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#A66DD4]";
		const goalsProLabel = document.createElement("p");
		goalsProLabel.textContent = i18next.t("goals_pro");
		goalsProLabel.className = "mt-2 font-orbitron font-bold";
		goalsProColumn.appendChild(goalsProBox);
		goalsProColumn.appendChild(goalsProLabel);

		const goalsConColumn = document.createElement("div");
		goalsConColumn.className = "flex flex-col items-center";
		const goalsConBox = document.createElement("div");
		goalsConBox.style.width = "60px";
		goalsConBox.style.height = "40px";
		goalsConBox.textContent = `${stats.goalsCon}`;
		goalsConBox.className = "flex justify-center items-center rounded-lg font-orbitron font-bold text-white bg-[#362A63]";
		const goalsConLabel = document.createElement("p");
		goalsConLabel.textContent = i18next.t("goals_con");
		goalsConLabel.className = "mt-2 font-orbitron font-bold";
		goalsConColumn.appendChild(goalsConBox);
		goalsConColumn.appendChild(goalsConLabel);

		columnsContainerGoals.appendChild(goalsProColumn);
		columnsContainerGoals.appendChild(goalsConColumn);
		personalNbrBox.appendChild(columnsContainerGoals);

	// Last Games Box
	const lastGamesBox = document.createElement("div");
	lastGamesBox.className = "bg-[#D9D9D9] text-gray-900 rounded-xl shadow-lg w-full h-[220px] max-w-sm overflow-y-auto flex-1";

		const lgheaderBar = document.createElement("div");
		lgheaderBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center w-full";
		const lastGametitle = document.createElement("h1");
		lastGametitle.textContent = i18next.t("last_games");
		lastGametitle.className = "text-white text-xl font-orbitron font-bold mb-0 text-center";
		lgheaderBar.appendChild(lastGametitle);
		lastGamesBox.appendChild(lgheaderBar);

		const gamesContainer = document.createElement("div");
		gamesContainer.className = "flex flex-col gap-4 p-4";
		// Aqui você pode popular com os últimos jogos do friend, se disponíveis
		if (friend.lastGames && Array.isArray(friend.lastGames)) {
			friend.lastGames.forEach(game => {
				const gameRow = document.createElement("div");
				gameRow.className = "flex items-center justify-between bg-gray-100 rounded-lg shadow px-4 py-2 w-full text-left hover:bg-gray-200 transition";

				const info = document.createElement("div");
				info.className = "flex gap-12 justify-between items-center";

				const result = document.createElement("span");
				result.textContent = i18next.t(game.result?.toLowerCase() || "").toUpperCase();
				result.className = `font-orbitron font-bold ${game.result === "Win" ? "text-[#2ecc71]" : "text-[#e74c3c]"}`;

				const match = document.createElement("span");
				match.textContent = `${game.youName} x ${game.friendName}`;
				match.className = "font-orbitron";

				info.appendChild(result);
				info.appendChild(match);
				gameRow.appendChild(info);
				gamesContainer.appendChild(gameRow);
			});
		} else {
			gamesContainer.innerHTML = `<div class='text-center text-gray-500'>${i18next.t("no_games")}</div>`;
		}
		lastGamesBox.appendChild(gamesContainer);

		// Layout lado a lado
		const boxesRow = document.createElement("div");
		boxesRow.className = "flex flex-row gap-8 w-full";
		boxesRow.appendChild(lastGamesBox);
		boxesRow.appendChild(personalNbrBox);

		// Botão fechar
		const closeBtn = document.createElement("button");
		closeBtn.textContent = i18next.t("close") || "Fechar";
		closeBtn.className = "mt-8 px-4 py-2 bg-[#174B7A] text-white font-orbitron rounded hover:bg-[#133A58] self-end";
		closeBtn.addEventListener("click", () => {
			modalBg.remove();
		});

		modal.appendChild(topRow);
		modal.appendChild(boxesRow);
		modal.appendChild(closeBtn);
		modalBg.appendChild(modal);

		document.body.appendChild(modalBg);
	}

	return container;
}
