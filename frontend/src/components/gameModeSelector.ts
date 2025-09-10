import i18next from "i18next";

type GameMode = "default" | "special";

export function GameModeSelector(
  onSelect: (mode: GameMode) => void,
  initialMode: GameMode = "default"
): HTMLDivElement {
  let selectedMode: GameMode = initialMode;

  const container = document.createElement("div");
  container.className = "flex flex-col items-center mt-6";

  // --- Título ---
  const title = document.createElement("p");
  title.textContent = i18next.t("select_game_mode");
  title.className = "text-white font-orbitron font-semibold text-xl mb-4";
  container.appendChild(title);

  // --- Botões ---
  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "flex gap-4 items-center";

  const defaultBtn = document.createElement("button");
  defaultBtn.textContent = i18next.t("default_mode");
  defaultBtn.className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";

  const specialBtn = document.createElement("button");
  specialBtn.textContent = i18next.t("special_mode");
  specialBtn.className = "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700";

  buttonsWrapper.appendChild(defaultBtn);
  buttonsWrapper.appendChild(specialBtn);
  container.appendChild(buttonsWrapper);

  const modeDesc = document.createElement("p");
  modeDesc.className = "text-gray-300 text-sm mt-2 h-5"; // altura fixa para evitar pular layout
  container.appendChild(modeDesc);

  specialBtn.addEventListener("mouseenter", () => {
    modeDesc.textContent = i18next.t("powerups_activated");
  });
  specialBtn.addEventListener("mouseleave", () => {
    modeDesc.textContent = "";
  });

  function updateVisuals() {
    if (selectedMode === "default") {
      defaultBtn.classList.add("ring-2", "ring-white");
      specialBtn.classList.remove("ring-2", "ring-white");
    } else {
      specialBtn.classList.add("ring-2", "ring-white");
      defaultBtn.classList.remove("ring-2", "ring-white");
    }
  }

  defaultBtn.addEventListener("click", () => {
    selectedMode = "default";
    updateVisuals();
    onSelect(selectedMode);
  });

  specialBtn.addEventListener("click", () => {
    selectedMode = "special";
    updateVisuals();
    onSelect(selectedMode);
  });

  updateVisuals();

  return container;
}