import { renderPage } from "../utils";
import { fetchFriendInvites, fetchUserAvatar, sendFriendInvite, acceptInvite, declineInvite, fetchFriends, unfriendUser } from "../logic/friendsLogic";

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
	searchInput.placeholder = "Search friend...";
	searchInput.className = "bg-gray-100 flex-1 px-3 py-2 rounded-md border-none outline-none";

	// Add Friend Button
	const addButton = document.createElement("button");
	addButton.textContent = "+ Add Friend";
	addButton.className =
		"bg-[#193D5E] text-white px-4 py-2 rounded-md font-orbitron font-semibold cursor-pointer transition-colors hover:bg-sky-950";


	addButton.addEventListener("click", () => {
		const friendName = searchInput.value.trim();
		if (!friendName) {
			alert("Digite o nome do amigo para enviar o convite");
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
		}"></span>${online ? "Online" : "Offline"}`;

		nameStatus.appendChild(name);
		nameStatus.appendChild(status);

		info.appendChild(avatar);
		info.appendChild(nameStatus);

		// Botão Unfriend
		const unfriendBtn = document.createElement("button");
		unfriendBtn.textContent = "Unfriend";
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
	reqTitle.textContent = "Friend Requests";
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
		acceptBtn.textContent = "Accept";
		acceptBtn.className =
			"bg-green-600 text-white px-3 py-1 rounded-md text-sm font-orbitron font-semibold cursor-pointer hover:bg-green-700 transition-colors";

		const declineBtn = document.createElement("button");
		declineBtn.textContent = "Decline";
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

	return container;
}
