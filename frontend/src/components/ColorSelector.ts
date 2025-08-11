export function ColorSelector(onColorSelect: (color: string) => void): HTMLElement {
	const colors = ['#A855F7', '#FACC15', '#22C55E', '#60A5FA', '#EC4899'];

	const container = document.createElement('div');
	container.className = 'flex flex-col items-center mt-6';

	const label = document.createElement('p');
	label.textContent = 'Select your color';
	label.className = 'text-white font-orbitron font-semibold text-xl mb-4';
	container.appendChild(label);

	const colorContainer = document.createElement('div');
	colorContainer.className = 'flex gap-4';

	colors.forEach((color) => {
		const btn = document.createElement('button');
		btn.className = 'w-8 h-8 border rounded hover:scale-105';
		btn.style.backgroundColor = color;

		btn.addEventListener('click', () => {
			onColorSelect(color);
			
			Array.from(colorContainer.children).forEach((child) =>
				(child as HTMLElement).classList.remove('ring-2')
			);
			btn.classList.add('ring-2', 'ring-white');
		});

		colorContainer.appendChild(btn);
	});

	container.appendChild(colorContainer);

	return container;
}