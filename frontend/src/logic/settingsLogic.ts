import { createSettingsUI } from "../pages/settingsPage";
import { API_ROUTES } from "../config";
import { getToken } from "../auth/authService";
import { setup2FA } from "../auth/2fa";

export async function setupSettingsLogic(elements: ReturnType<typeof createSettingsUI>) {
  const { emailInput, usernameInput, img, submitBtn, toggleInput2FA } = elements;
  
  const token = getToken();
  async function loadUserProfile() {

    try {
      const res = await fetch(`${API_ROUTES.me}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();

	  console.log(data);

      emailInput.value = data.email || '';
      usernameInput.value = data.username || '';
      img.src = data.avatar || "/images/randomAvatar/0.jpeg"; //find when don't have img
      toggleInput2FA.checked = data.has2fa || false;
      sessionStorage.setItem('id', data.id);

    } catch (err) {
      alert('Error loading profile: ' + err);
    }
  }

  // Submit logic to update user profile
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const updatedData = {
      email: emailInput.value,
      username: usernameInput.value,
      // password: ..., // se quiser enviar senha
      twoFAEnabled: toggleInput2FA.checked,
    };

    try {
      const res = await fetch('/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error('Failed to update user profile');
      }

    } catch (err) {
      alert(err);
    }
  });

  setup2FA(toggleInput2FA);
  await loadUserProfile();
}

export function setupAvatarControls(
  img: HTMLImageElement,
  btnUpload: HTMLButtonElement,
  btnRandom: HTMLButtonElement
): void {
  // Upload
  btnUpload.addEventListener("click", () => {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      if (input.files && input.files[0]) {
        const file: File = input.files[0];
        img.src = URL.createObjectURL(file);
        uploadAvatar(file);
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
      if (!res.ok) throw new Error("Falha ao carregar avatar local");

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
      console.error(error);
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
      alert("Error uploading avatar");
      return;
    }

  } catch (error) {
    console.error("Erro na requisição de upload:", error);
    alert("An error occurred while trying to upload the avatar.");
  }
}
