import { API_ROUTES } from "../config";
import { getToken } from "./authService";

export function setup2FA(toggleInput2FA: HTMLInputElement) {
	toggleInput2FA.addEventListener("change", async () => {

		const token = getToken();
		

		if (toggleInput2FA.checked) {
		  try {
			const setupRes = await fetch(`${API_ROUTES.setup2FA}`, {
			  method: "POST",
			  headers: {
				"Authorization": `Bearer ${token}`
			  }
			});
	  
			if (!setupRes.ok) {
			  const err = await setupRes.json();
			  alert(`Error: ${err.message}`);
			  toggleInput2FA.checked = false;
			  return;
			}
	  
			const { qrCode } = await setupRes.json();
	
			const code = await showQRCodeModal(qrCode);
	
			if (!code) {
			  toggleInput2FA.checked = false;
			  return;
			}
	
			const enableRes = await fetch(`${API_ROUTES.enable2FA}`, {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			  },
			  body: JSON.stringify({ code })
			});
	  
			if (!enableRes.ok) {
			  const err = await enableRes.json();
			  alert(`Error enabling 2FA: ${err.message}`);
			  toggleInput2FA.checked = false;
			  return;
			}
	  
			alert("✅ 2FA Enabled successfully!");
	  
		  } catch (error) {
			console.error(error);
			alert("An error occurred while setting up 2FA.");
			toggleInput2FA.checked = false;
		  }
		}
	  });
	
}

export function showQRCodeModal(qrCodeSrc: string): Promise<string | null> {
  return new Promise((resolve) => {
 
  const overlay = document.createElement("div");
  overlay.className = `
	fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50
  `;

  const modal = document.createElement("div");
  modal.className = `
	relative bg-white p-6 rounded-lg max-w-xs w-full text-center
  `;

  // QR Code image
  const img = document.createElement("img");
  img.src = qrCodeSrc;
  img.alt = "QR Code 2FA";
  img.className = "w-64 h-64 mx-auto";

  // Close "X"
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.className = `
	absolute top-2 right-2 text-gray-600 hover:text-gray-400 text-2xl font-bold
	focus:outline-none
  `;
  closeBtn.addEventListener("click", () => {
	document.body.removeChild(overlay);
	resolve(null);
  });

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.className = `
	mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition
  `;

  nextBtn.addEventListener("click", () => {
	modal.removeChild(img);
	modal.removeChild(nextBtn);

	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = "Type code";
	input.className = "border p-2 rounded w-full";
	modal.appendChild(input);

	const submitBtn = document.createElement("button");
	submitBtn.textContent = "Submit";
	submitBtn.className = `
	  mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition
	`;
	modal.appendChild(submitBtn);

	submitBtn.addEventListener("click", () => {
	  const code = input.value.trim();
		if (code === "") {
		  alert("Please enter the code");
		  return;
		}
		document.body.removeChild(overlay);
		resolve(code);
	});
  });

  modal.appendChild(closeBtn);
  modal.appendChild(img);
  modal.appendChild(nextBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
});
}