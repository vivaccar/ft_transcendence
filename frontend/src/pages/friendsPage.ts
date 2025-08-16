import { renderPage } from "../utils";

export function buildFriendsPage(): void {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const friendsUI = createFriendsUI();
	container.appendChild(friendsUI);
}

function createFriendsUI(): HTMLDivElement {
	const container = document.createElement("div");
	container.className = "flex items-center justify-center w-screen h-screen gap-6";

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

	pnheaderBar.appendChild(searchInput);
	pnheaderBar.appendChild(addButton);

	// Lista de amigos (scrollável)
	const friendsList = document.createElement("div");
	friendsList.className =
		"flex-1 overflow-y-auto p-4 flex flex-col gap-4";

	// exemplo, depois vai mudar para a logica do backend
	const friends = [
		{ name: "Vivaccar", online: true, img: "/images/randomAvatar/3.jpeg" },
		{ name: "Marcelo_Gaucho", online: false, img: "/images/randomAvatar/2.jpeg" },
		{ name: "Nicole", online: true, img: "/images/randomAvatar/4.jpeg" },
	];

	friends.forEach(friend => {
		const friendRow = document.createElement("div");
		friendRow.className =
			"flex items-center justify-between bg-gray-100 rounded-lg shadow px-4 py-2";

		// Foto + Nome + Status
		const info = document.createElement("div");
		info.className = "flex items-center gap-3";

		const avatar = document.createElement("img");
		avatar.src = friend.img;
		avatar.className = "w-10 h-10 object-cover rounded-full border border-gray-300";

		const nameStatus = document.createElement("div");
		nameStatus.className = "flex flex-col";

		const name = document.createElement("span");
		name.textContent = friend.name;
		name.className = "font-orbitron";

		const status = document.createElement("span");
		status.className = `flex items-center text-sm ${
			friend.online ? "text-green-600" : "text-red-600"
		}`;
		status.innerHTML = `<span class="w-2 h-2 rounded-full mr-1 ${
			friend.online ? "bg-green-500" : "bg-red-500"
		}"></span>${friend.online ? "Online" : "Offline"}`;

		nameStatus.appendChild(name);
		nameStatus.appendChild(status);

		info.appendChild(avatar);
		info.appendChild(nameStatus);

		// Botão Unfriend
		const unfriendBtn = document.createElement("button");
		unfriendBtn.textContent = "Unfriend";
		unfriendBtn.className =
			"bg-[#193D5E] text-white px-3 py-1 rounded-md text-sm font-orbitron font-semibold cursor-pointer hover:bg-red-700 transition-colors";
	
		friendRow.appendChild(info);
		friendRow.appendChild(unfriendBtn);

		friendsList.appendChild(friendRow);
	});

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

	// Dummy requests
	const requests = [
		{ name: "Victor", img: "/images/randomAvatar/1.jpeg" },
	];

	requests.forEach(req => {
		const reqRow = document.createElement("div");
		reqRow.className =
			"flex items-center justify-between bg-gray-100 rounded-lg shadow px-4 py-2";

		const info = document.createElement("div");
		info.className = "flex items-center gap-3";

		const avatar = document.createElement("img");
		avatar.src = req.img;
		avatar.className = "w-10 h-10 object-cover rounded-full border border-gray-300";

		const name = document.createElement("span");
		name.textContent = req.name;
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

		btnGroup.appendChild(acceptBtn);
		btnGroup.appendChild(declineBtn);

		reqRow.appendChild(info);
		reqRow.appendChild(btnGroup);

		requestsList.appendChild(reqRow);
	});

	requestsBox.appendChild(reqHeader);
	requestsBox.appendChild(requestsList);


	container.appendChild(friendsBox);
	container.appendChild(requestsBox);

	return container;
}
