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
  title.textContent = "Select Game Mode";
  title.className = "text-white font-orbitron font-semibold text-xl mb-4";
  container.appendChild(title);

  // --- Botões ---
  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "flex gap-4 items-center";

  const defaultBtn = document.createElement("button");
  defaultBtn.textContent = "Default Mode";
  defaultBtn.className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";

  const specialBtn = document.createElement("button");
  specialBtn.textContent = "Special Mode";
  specialBtn.className = "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700";

  buttonsWrapper.appendChild(defaultBtn);
  buttonsWrapper.appendChild(specialBtn);
  container.appendChild(buttonsWrapper);

  const modeDesc = document.createElement("p");
  modeDesc.className = "text-gray-300 text-sm mt-2 h-5"; // altura fixa para evitar pular layout
  container.appendChild(modeDesc);

  specialBtn.addEventListener("mouseenter", () => {
    modeDesc.textContent = "Ball increases speed";
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