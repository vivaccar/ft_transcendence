export function BackgroundCarousel(onSelect: (bgId: string) => void): HTMLElement {
	const backgrounds = [
		{ id: 'starry', imgSrc: '/images/backgroundGame/back10.jpg' },
		{ id: 'desert', imgSrc: '/images/backgroundGame/back11.jpg' },
		{ id: 'forest', imgSrc: '/images/backgroundGame/back12.jpg' },
	];

	let currentIndex = 0;

	const container = document.createElement('div');
	container.className = 'flex items-center justify-center w-4/5 max-w-3xl h-72 md:h-96 rounded-lg overflow-hidden relative border border-[#00F0FF]';

	const image = document.createElement('img');
	image.src = backgrounds[currentIndex].imgSrc;
	image.className = 'w-full h-full object-cover transition duration-300';
	container.appendChild(image);

	const leftBtn = document.createElement('button');
	leftBtn.innerHTML = '&#x25C0;';
	leftBtn.className = 'absolute left-4 top-1/2 -translate-y-1/2 arrow';
	container.appendChild(leftBtn);

	const rightBtn = document.createElement('button');
	rightBtn.innerHTML = '&#x25B6;';
	rightBtn.className = 'absolute right-4 top-1/2 -translate-y-1/2 arrow';
	container.appendChild(rightBtn);

	function update() {
		image.src = backgrounds[currentIndex].imgSrc;
		onSelect(backgrounds[currentIndex].imgSrc);
	}

	leftBtn.onclick = () => {
		currentIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length;
		update();
	};

	rightBtn.onclick = () => {
		currentIndex = (currentIndex + 1) % backgrounds.length;
		update();
	};

	return container;
}