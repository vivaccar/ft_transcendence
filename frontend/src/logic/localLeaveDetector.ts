import { cleanupGame } from '../game/localPong/Game';

export const localLeaveDetector = {
    observer: null as MutationObserver | null,
    isObserving: false,

    start: function() {
        if (this.isObserving) {
            return;
        }

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
        
        this.isObserving = true;
    },

    handleLeave: () => {
        if (!localLeaveDetector.isObserving) return;
        
        cleanupGame();
        localLeaveDetector.stop(); 
    },

    stop: function() {
        window.removeEventListener('beforeunload', this.handleLeave);
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.isObserving) {
            this.isObserving = false;
        }
    }
};