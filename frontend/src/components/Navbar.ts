export function Navbar(): HTMLElement {
	const nav = document.createElement('nav');
	nav.className = 'bg-[#174B7A] text-white font-orbitron font-semibold px-8 py-4 flex justify-between items-center';

	const ul = document.createElement('ul');
	ul.className = 'flex gap-6';

	const links = ['Games', 'Friends', 'Statistics', 'Settings'];

	links.forEach((text) => {
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.href = `/${text.toLowerCase()}`;
		a.textContent = text;
		a.className = 'inline-block transform transition-transform hover:scale-105';
		li.appendChild(a);
		ul.appendChild(li);
	});

	const logout = document.createElement('a');
	logout.href = '/logout';
	logout.textContent = 'Logout';
	logout.className = 'inline-block transform transition-transform hover:scale-105';

	nav.appendChild(ul);
	nav.appendChild(logout);

	return nav;
}