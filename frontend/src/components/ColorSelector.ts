export function ColorSelector(onColorSelect: (color: string) => void): HTMLElement {
	const colors = ['#A855F7', '#FACC15', '#22C55E', '#60A5FA', '#EC4899'];
	let selectedColor = '';

	const container = document.createElement('div');
	container.className = 'flex flex-col items-center mt-6';

	const label = document.createElement('p');
	label.textContent = 'Select your color';
	label.className = 'text-white font-orbitron font-bold text-xl mb-4';
	container.appendChild(label);

	const colorContainer = document.createElement('div');
	colorContainer.className = 'flex gap-4';

	colors.forEach((color) => {
		const btn = document.createElement('button');
		btn.className = 'w-8 h-8 border rounded hover:scale-105';
		btn.style.backgroundColor = color;

		btn.addEventListener('click', () => {
			selectedColor = color;
			onColorSelect(color);
			
			Array.from(colorContainer.children).forEach((child) =>
				(child as HTMLElement).classList.remove('ring-2')
			);
			btn.classList.add('ring-2', 'ring-white');
		});

		colorContainer.appendChild(btn);
	});

	container.appendChild(colorContainer);

	const startBtn = document.createElement('button');
	startBtn.textContent = 'Start';
	startBtn.className = 'mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition';
	startBtn.addEventListener('click', () => {
		console.log('Start game with color:', selectedColor);
	});
	container.appendChild(startBtn);

	return container;
}