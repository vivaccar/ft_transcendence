import { Navbar } from '../components/Navbar';

export function buildDashboard(): void {
	const title = document.getElementById('pongTitle');
	title?.remove();
	
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;

	app.classList.remove('justify-center');
	app.classList.add('justify-start');
	app.classList.add('m-0', 'p-0', 'w-full');
	app.innerHTML = '';

	app.appendChild(Navbar());
	app.appendChild(buildGameCards());

	// const selectCards = document.createElement('div');
	// selectCards.id = 'selectCards';
	// selectCards.className = 'flex justify-between items-center bg-gray';


	// const content = document.createElement('div');
	// content.className = 'text-blue-600 flex flex-col gap-2 mt-4';
	// content.innerHTML = `
	// 	<div>Play Single Game</div>
	// 	<div>Play tournament</div>
	// 	<div>Search Friends</div>
	// 	<div>See statistics</div>
	// `;

	// app.appendChild(content);
}

function buildGameCards(): HTMLElement {
	const container = document.createElement('div');
	container.className = 'min-h-screen flex items-center justify-center gap-16';

	const cards = [
		{ title: 'Man vs AI', imgSrc: '/images/card1.jpeg' },
		{ title: 'Man vs Man', imgSrc: '/images/card2.jpeg' },
		{ title: 'Tournament', imgSrc: '/images/card3.jpeg' },
	];

	cards.forEach(({ title, imgSrc }) => {
		const card = document.createElement('div');
		card.className = 'relative w-80 h-3/4 overflow-hidden rounded border border-[#00F0FF] cursor-pointer transform transition-transform duration-300 hover:scale-105'; 
		card.style.backgroundImage = `url(${imgSrc})`;
		card.style.backgroundSize = 'cover';
		card.style.backgroundPosition = 'center';
	
		const titleDiv = document.createElement('div');
		titleDiv.className = 'absolute left-0 w-full bg-black bg-opacity-60 text-white text-center py-3 font-orbitron text-lg';
		titleDiv.style.backgroundColor = 'transparent';
		titleDiv.style.textShadow = 'none'; 
		titleDiv.textContent = title;
	
		container.appendChild(card);
		card.appendChild(titleDiv);
	  });

	return container;
}