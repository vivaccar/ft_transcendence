import { Navbar } from '../components/Navbar';
import { navigate } from '../router';

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
}

function buildGameCards(): HTMLElement {
	const container = document.createElement('div');
	container.className = 'min-h-screen flex items-center justify-center gap-16';

	const cards = [
		{ title: 'Man vs AI', imgSrc: '/images/dashboardCards/card1.jpeg', url: 'ai-game' },
		{ title: 'Man vs Man\nLocal', imgSrc: '/images/dashboardCards/card2.jpeg', url: 'human-game-local' },
		{ title: 'Man vs Man\nRemote', imgSrc: '/images/dashboardCards/card5.jpeg', url: 'human-game-remote' },
		{ title: 'Tournament', imgSrc: '/images/dashboardCards/card3.jpeg', url: 'tournament' },
	];

	cards.forEach(({ title, imgSrc, url }) => {
		const card = document.createElement('a');
		card.className = 'relative w-80 h-3/4 overflow-hidden rounded border border-[#00F0FF]\
						cursor-pointer transform transition-transform duration-300 hover:scale-105'; 
		card.style.backgroundImage = `url(${imgSrc})`;
		card.style.backgroundSize = 'cover';
		card.style.backgroundPosition = 'center';
		card.href = `/${url}`;

		card.addEventListener("click", (e) => {
			e.preventDefault(); 
			navigate(`/${url}`);
		});
	
		const titleDiv = document.createElement('div');
		titleDiv.className = 'absolute left-0 w-full bg-black bg-opacity-60 text-white text-center\
							 py-3 font-orbitron font-bold text-lg';
		titleDiv.style.backgroundColor = 'transparent';
		titleDiv.style.textShadow = 'none'; 
		titleDiv.textContent = title;
	
		container.appendChild(card);
		card.appendChild(titleDiv);
	  });

	return container;
}