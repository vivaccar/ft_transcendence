import { createSettingsUI } from "../pages/settingsPage";
import { API_ROUTES } from "../config";
import { getToken } from "../auth/authService";
import { setup2FA } from "../auth/2fa";
import { setUserInfo } from "../utils";
import i18next from "i18next";
import { fetchUserAvatar } from "./friendsLogic";


export async function setupSettingsLogic(elements: ReturnType<typeof createSettingsUI>) {
  const { 
    emailInput, 
    usernameInput, 
    img, 
    oldPasswordInput, 
    passwordInput, 
    confirmPasswordInput, 
    submitBtn,
    editBtn,
    toggleInput2FA 
  } = elements;
  
  const token = getToken();
  let currentUsername = '';

  async function loadUserProfile() {

    try {
      const res = await fetch(`${API_ROUTES.me}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();

      emailInput.value = data.email || '';
      usernameInput.value = data.username || '';
      toggleInput2FA.checked = data.has2fa || false;
      oldPasswordInput.value = '';

      currentUsername = data.username || ''; 

      img.src = await fetchUserAvatar(currentUsername);
    } catch (err) {
      alert('Error loading profile: ' + err);
    }
  }

  // Submit logic to update user profile
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    try {
      if (usernameInput.value && usernameInput.value !== currentUsername) {
        const resUsername = await fetch(API_ROUTES.username, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newUsername: usernameInput.value }),
        });
  
        const data = await resUsername.json();
        if (!resUsername.ok) {
          alert("Error updating username: " + data.message);
          return;
        }
      }
  
      if (oldPasswordInput.value && passwordInput.value && confirmPasswordInput.value) {
        if (passwordInput.value !== confirmPasswordInput.value) {
          alert(i18next.t("password_mismatch"));
          return;
        }
  
        const resPassword = await fetch(API_ROUTES.password, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword: oldPasswordInput.value,
            newPassword: passwordInput.value,
          }),
        });
  
        const data = await resPassword.json();
        if (!resPassword.ok) {
          alert("Error updating password: " + data.message);
          return;
        }
      }
  
      currentUsername = usernameInput.value;

      usernameInput.className = 'inputBlocked';
		  usernameInput.disabled = true;
		  oldPasswordInput.classList.add('hidden');
		  passwordInput.classList.add('hidden');
		  confirmPasswordInput.classList.add('hidden');
		  submitBtn.classList.add('hidden');
		  editBtn.classList.remove('hidden');
      setUserInfo();

    } catch (err) {
      alert("Unexpected error: " + err);
    }
  });

  setup2FA(toggleInput2FA);
  await loadUserProfile();
}

export async function setupAvatarControls(
  img: HTMLImageElement,
  btnUpload: HTMLButtonElement,
  btnRandom: HTMLButtonElement
): Promise<void> {
  // Upload
  btnUpload.addEventListener("click", () => {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        try {
          const file: File = input.files[0];
          await uploadAvatar(file);
          img.src = URL.createObjectURL(file);
        } catch (error) {
          alert(`${error}`);
        }
      }
    };

    input.click();
  });

  // Random avatar
  btnRandom.addEventListener("click", async () => {
    try {
      const randomIndex = Math.floor(Math.random() * 9) + 1;
      const avatarPath = `/images/randomAvatar/${randomIndex}.jpeg`;

      const res = await fetch(avatarPath);
      if (!res.ok) throw new Error("Error while updating local avatar");

      const blob = await res.blob();

      const file = new File([blob], `avatar${randomIndex}.jpeg`, { type: blob.type });

      img.src = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("avatar", file);

      const token = getToken();

      const uploadResponse = await fetch(`${API_ROUTES.uploadAvatar}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        throw new Error(`Error uploading avatar: ${error}`);
      }

    } catch (error) {
      alert("Error updating avatar");
    }
});
}

async function uploadAvatar(file: File): Promise<void> {
	const formData: FormData = new FormData();
	formData.append("avatar", file);
	const token = getToken();
	
	try {
		const res: Response = await fetch(`${API_ROUTES.uploadAvatar}`, {
			method: "POST",
			body: formData,
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		
		if (!res.ok) {
        throw new Error("Error uploading avatar");
    }

  } catch (error) {
    throw new Error("An error occurred while trying to upload the avatar.");
  }
}
