export function buildDashboard(): void {
	const app = document.querySelector<HTMLDivElement>('#app');
	if (!app) return;
	
	app.innerHTML = `
		<div class="text-blue-600">Play Single Game</div>
		<div class="text-blue-600">Play tournament</div>
		<div class="text-blue-600">Search Friends</div>
		<div class="text-blue-600">See statistics</div>
	`;
}