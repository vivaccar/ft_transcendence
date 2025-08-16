import { setupAvatarControls/* , setupSettingsLogic */ } from "../logic/settingsLogic";
import { renderPage } from "../utils";

export function buildSettingsPage(): void {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";

	renderPage(container);

	const settingsUI = createSettingsUI();

	container.appendChild(settingsUI.container);
	// setupSettingsLogic(settingsUI);
}

export function createSettingsUI(): {
	container: HTMLDivElement,
	emailInput: HTMLInputElement,
	usernameInput: HTMLInputElement,
	img: HTMLImageElement,
	passwordInput: HTMLInputElement,
	confirmPasswordInput: HTMLInputElement,
	submitBtn: HTMLButtonElement,
	toggleInput2FA: HTMLInputElement
  } {
	const container = document.createElement("div");
	container.className = "flex flex-col items-center justify-center h-screen gap-6";
  
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
	profileSection.className = "flex items-center mb-10 gap-10 p-8";
  
	const img = document.createElement("img");
	img.src = "/images/randomAvatar/0.jpeg";
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
	form.className = "flex flex-col gap-4 p-8 pt-0 font-orbitron";
  
	const emailInput = document.createElement("input");
	emailInput.type = "email";
	emailInput.placeholder = "Email";
	emailInput.className = "p-2 rounded bg-gray-100 border border-gray-300";
	form.appendChild(emailInput);
  
	const usernameInput = document.createElement("input");
	usernameInput.type = "text";
	usernameInput.placeholder = "Username";
	usernameInput.className = "p-2 rounded bg-gray-100 border border-gray-300";
	form.appendChild(usernameInput);
  
	const passwordInput = document.createElement("input");
	passwordInput.type = "password";
	passwordInput.placeholder = "New Password";
	passwordInput.className = "p-2 rounded bg-gray-100 border border-gray-300";
	form.appendChild(passwordInput);
  
	const confirmPasswordInput = document.createElement("input");
	confirmPasswordInput.type = "password";
	confirmPasswordInput.placeholder = "Confirm Password";
	confirmPasswordInput.className = "p-2 rounded bg-gray-100 border border-gray-300";
	form.appendChild(confirmPasswordInput);
  
	box.appendChild(form);
  
	// 2FA toggle
	const twoFAContainer = document.createElement("div");
	twoFAContainer.className = "flex items-center mt-4 gap-6 p-8 pt-0";
  
	const twoFAText = document.createElement("span");
	twoFAText.textContent = "Enable 2FA";
	twoFAText.className = "text-lg font-medium";
	twoFAContainer.appendChild(twoFAText);
  
	const toggleLabel = document.createElement("label");
	toggleLabel.className = "relative inline-flex items-center cursor-pointer";
  
	const toggleInput2FA = document.createElement("input");
	toggleInput2FA.type = "checkbox";
	toggleInput2FA.className = "sr-only peer";

	const has2FA = sessionStorage.getItem("has2fa") === "true";
	toggleInput2FA.checked = has2FA;

	const toggleSpan = document.createElement("span");
	toggleSpan.className =
	  "w-11 h-6 bg-red-400 rounded-full peer peer-checked:bg-green-500 " +
	  "after:content-[''] after:absolute after:top-[2px] after:left-[2px] " +
	  "after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all " +
	  "peer-checked:after:translate-x-full peer-checked:after:border-white";
  
	toggleLabel.appendChild(toggleInput2FA);
	toggleLabel.appendChild(toggleSpan);
	twoFAContainer.appendChild(toggleLabel);
  
	box.appendChild(twoFAContainer);
  
	container.appendChild(box);
  
	// submit button
	const submitBtn = document.createElement("button");
	submitBtn.textContent = "Submit";
	submitBtn.className = "px-5 py-2 bg-[#5FBE00] font-orbitron text-white rounded hover:bg-[#133A58] transition";
	container.appendChild(submitBtn);
  
	return {
	  container,
	  emailInput,
	  usernameInput,
	  img,
	  passwordInput,
	  confirmPasswordInput,
	  submitBtn,
	  toggleInput2FA,
	};
  }