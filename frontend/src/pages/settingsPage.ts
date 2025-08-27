import { setupAvatarControls, setupSettingsLogic  } from "../logic/settingsLogic";
import { renderPage } from "../utils";

export function buildSettingsPage(): void {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const settingsUI = createSettingsUI();

	container.appendChild(settingsUI.container);
	setupSettingsLogic(settingsUI);
}

export function createSettingsUI(): {
	container: HTMLDivElement,
	emailInput: HTMLInputElement,
	usernameInput: HTMLInputElement,
	img: HTMLImageElement,
	passwordInput: HTMLInputElement,
	confirmPasswordInput: HTMLInputElement,
	submitBtn: HTMLButtonElement,
	editBtn: HTMLButtonElement,
	toggleInput2FA: HTMLInputElement,
	oldPasswordInput: HTMLInputElement
  } {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4";
  
	const box = document.createElement("div");
	box.className = "bg-white text-gray-900 rounded-xl shadow-lg w-full max-w-2xl";
	box.style.background = "#D9D9D9";
  
	// headerBar e título
	const headerBar = document.createElement("div");
	headerBar.className = "bg-[#174B7A] px-8 py-6 rounded-t-lg flex justify-center items-center";
  
	const title = document.createElement("h1");
	title.textContent = "Player Settings";
	title.className = "text-xl font-orbitron font-bold mb-0 text-center";
	title.style.color = "white";
  
	headerBar.appendChild(title);
	box.insertBefore(headerBar, box.firstChild);
  
	// profile section
	const profileSection = document.createElement("div");
	profileSection.className = "flex items-center mb-2 gap-6 p-8 pb-4";
  
	const img = document.createElement("img");
	// img.src = "/images/randomAvatar/0.jpeg";
	img.className = "w-32 h-32 object-cover rounded-full border-4 border-gray-300";
	profileSection.appendChild(img);
  
	// choose avatar buttons, texto etc
	const chooseAvatar = document.createElement("div");
	chooseAvatar.className = "flex flex-col items-center gap-4";
  
	const text = document.createElement("p");
	text.textContent = "Upload a new avatar or choose a random one";
	text.className = "text-lg font-orbitron text-center text-gray-700";
	chooseAvatar.appendChild(text);
  
	const buttons = document.createElement("div");
	buttons.className = "flex items-center gap-4";
  
	const btnUpload = document.createElement("button");
	btnUpload.textContent = "Upload Photo";
	btnUpload.className = "px-5 py-2 bg-[#174B7A] font-orbitron text-white rounded hover:bg-[#133A58] transition";
	buttons.appendChild(btnUpload);
  
	const btnRandom = document.createElement("button");
	btnRandom.textContent = "Random Avatar";
	btnRandom.className = "px-5 py-2 bg-[#174B7A] font-orbitron text-white rounded hover:bg-[#133A58] transition";
	buttons.appendChild(btnRandom);
  
	chooseAvatar.appendChild(buttons);
  
	profileSection.appendChild(chooseAvatar);
	box.appendChild(profileSection);

	setupAvatarControls(img, btnUpload, btnRandom);
  
	// form
	const form = document.createElement("form");
	form.className = "flex flex-col gap-2 p-4 pt-0 font-orbitron";

	// Email
	const emailInput = document.createElement("input");
	emailInput.type = "email";
	emailInput.placeholder = "Email";
	emailInput.className = "inputBlocked";
	emailInput.disabled = true;
	form.appendChild(emailInput);

	// Username
	const usernameInput = document.createElement("input");
	usernameInput.type = "text";
	usernameInput.placeholder = "Username";
	usernameInput.className = "inputBlocked";
	usernameInput.disabled = true;

	form.appendChild(usernameInput);

	// Current Password
	const oldPasswordInput = document.createElement("input");
	oldPasswordInput.type = "password";
	oldPasswordInput.placeholder = "Current Password";
	oldPasswordInput.className = "p-2 rounded bg-gray-100 border border-gray-300 hidden";
	form.appendChild(oldPasswordInput);

	// New Password
	const passwordInput = document.createElement("input");
	passwordInput.type = "password";
	passwordInput.placeholder = "New Password";
	passwordInput.className = "p-2 rounded bg-gray-100 border border-gray-300 hidden";
	form.appendChild(passwordInput);

	// Confirm Password
	const confirmPasswordInput = document.createElement("input");
	confirmPasswordInput.type = "password";
	confirmPasswordInput.placeholder = "Confirm Password";
	confirmPasswordInput.className = "p-2 rounded bg-gray-100 border border-gray-300 hidden";
	form.appendChild(confirmPasswordInput);

	box.appendChild(form);
	// 2FA toggle
	const twoFAContainer = document.createElement("div");
	twoFAContainer.className = "flex items-center mt-4 gap-6 p-4 pb-0 pt-0";
  
	const twoFAText = document.createElement("span");
	twoFAText.textContent = "Enable 2FA";
	twoFAText.className = "text-lg font-orbitron font-medium";
	twoFAContainer.appendChild(twoFAText);
  
	const toggleLabel = document.createElement("label");
	toggleLabel.className = "relative inline-flex items-center cursor-pointer";
  
	const toggleInput2FA = document.createElement("input");
	toggleInput2FA.type = "checkbox";
	toggleInput2FA.className = "sr-only peer";

	const has2FA = sessionStorage.getItem('has2fa') === 'true'
	toggleInput2FA.checked = has2FA;

	const toggleSpan = document.createElement("span");
	toggleSpan.className = "w-11 h-6 rounded-full transition-colors relative " +
		(has2FA ? "bg-green-500" : "bg-red-400") + " " +
		"peer-checked:bg-green-500 " +
		"after:content-[''] after:absolute after:top-[2px] after:bg-white " +
		"after:rounded-full after:h-5 after:w-5 after:transition-all " +
		(has2FA ? "after:translate-x-full after:border-white" : "after:left-[2px]") + " " +
		"peer-checked:after:translate-x-full peer-checked:after:border-white";
	toggleLabel.appendChild(toggleInput2FA);
	toggleLabel.appendChild(toggleSpan);
	twoFAContainer.appendChild(toggleLabel);
  
	box.appendChild(twoFAContainer);
  
	container.appendChild(box);
  
	// submit button
	const submitBtn = document.createElement("button");
	submitBtn.textContent = "Submit";
	submitBtn.className = 'px-6 py-3 bg-[#174B7A] font-orbitron font-bold text-white rounded-lg shadow-md hover:bg-[#133A58] active:bg-[#0F2A3D] transition-colors duration-200 mt-6 self-center hidden';

	const editBtn = document.createElement("button");
 	editBtn.textContent = "Edit";
 	editBtn.className = 'px-6 py-3 bg-[#174B7A] font-orbitron font-bold text-white rounded-lg shadow-md hover:bg-[#133A58] active:bg-[#0F2A3D] transition-colors duration-200 mt-6 self-center';
 	editBtn.addEventListener("click", async (e) => {
		e.preventDefault();

		usernameInput.className = 'inputUnblocked';
		usernameInput.disabled = false;
		if (sessionStorage.getItem('googleUser') === 'false'){

			oldPasswordInput.classList.remove('hidden');
			passwordInput.classList.remove('hidden');
			confirmPasswordInput.classList.remove('hidden');
		} 
		submitBtn.classList.remove('hidden');
		editBtn.classList.add('hidden');
	});

	const btnWrapper = document.createElement("div");
	btnWrapper.className = "flex justify-center mt-1 mb-2";
	btnWrapper.appendChild(submitBtn);
	btnWrapper.appendChild(editBtn);
	box.appendChild(btnWrapper);
  
	return {
	  container,
	  emailInput,
	  usernameInput,
	  img,
	  oldPasswordInput,
	  passwordInput,
	  confirmPasswordInput,
	  submitBtn,
	  editBtn,
	  toggleInput2FA,
	};
  }