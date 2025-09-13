export function buildNotFoundPage() {
	const root = document.getElementById("app");
	if (root) {
	  root.innerHTML = `
		<div class="flex flex-col items-center justify-center h-screen text-center">
		  <h1 class="text-6xl font-bold text-red-500">404</h1>
		  <p class="text-xl mt-4 text-white">Oops! Page not found.</p>
		</div>
	  `;
	}
}