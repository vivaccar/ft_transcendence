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

        // 2. Deteção de navegação interna da SPA, observando quando o canvas é removido do DOM.
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
        console.log("✅ Detector de Saída Local ATIVADO.");
    },

    /**
     * Ação a ser executada quando a saída é detetada.
     * Invoca a função de limpeza do jogo para parar tudo de forma segura.
     */
    handleLeave: () => {
        if (!localLeaveDetector.isObserving) return;
        
        console.log("👋 Saída do jogo local detetada. A limpar recursos...");
        cleanupGame();
        localLeaveDetector.stop(); // Para o próprio detector para evitar chamadas múltiplas.
    },

    /**
     * Para e limpa todos os listeners e observadores.
     * É crucial chamar isto quando o jogo termina normalmente.
     */
    stop: function() {
        window.removeEventListener('beforeunload', this.handleLeave);
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.isObserving) {
            this.isObserving = false;
            console.log("🛑 Detector de Saída Local DESATIVADO.");
        }
    }
};