import { sendMessage, disconnectWebSocket } from "../socketService";

export const leaveDetector = {
	observer: null as MutationObserver | null,
	hasLeft: false,

	start: function() {
		this.hasLeft = false;

		const gameElement = document.getElementById('game-canvas');
		if (!gameElement) {
			console.error("Error. leaveDetector was not able to find game canvas");
			return;
		}

		window.addEventListener('beforeunload', this.handleLeave);

		const appElement = document.querySelector('#app');
		if (appElement) {
			this.observer = new MutationObserver((mutationsList) => {
				for (const mutation of mutationsList) {
					if (mutation.removedNodes.length > 0) {
						mutation.removedNodes.forEach(node => {
							if (node.contains(gameElement)) {
								this.handleLeave();
							}
						});
					}
				}
			});
			this.observer.observe(appElement, { childList: true, subtree: true });
		}
	},

	handleLeave: () => {
		if (leaveDetector.hasLeft) 
			return;
		leaveDetector.hasLeft = true;
		sendMessage({ type: 'player_left_game' });
		disconnectWebSocket();
		leaveDetector.stop();
	},

	stop: function() {
		window.removeEventListener('beforeunload', this.handleLeave);
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		this.hasLeft = true;
	}
};
