export function ErrorMessage(text: string): HTMLElement {
	const message = document.createElement('p');
	message.textContent = text;
	message.className = 'text-red-500 font-orbitron mt-8';
	return message;
}