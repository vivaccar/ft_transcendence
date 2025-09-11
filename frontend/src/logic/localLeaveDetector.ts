// frontend/src/logic/localLeaveDetector.ts

// A função que o detector precisa de chamar para limpar o jogo.
import { cleanupGame } from '../game/localPong/Game';

/**
 * Gestor de estado e lógica para a deteção de saída do jogo local.
 * Este objeto é um singleton, o que significa que só existe uma instância dele na aplicação.
 */
export const localLeaveDetector = {
    observer: null as MutationObserver | null,
    isObserving: false,

    /**
     * Inicia a observação da página para detetar quando o jogador sai do jogo.
     */
    start: function() {
        if (this.isObserving) {
            console.log("DETECTOR: Já se encontra ativo.");
            return;
        }

        const gameElement = document.getElementById('game-canvas');
        if (!gameElement) {
            console.error("DETECTOR: Não foi possível encontrar '#game-canvas'. A deteção de saída não funcionará.");
            return;
        }

        // 1. Deteção de fecho de aba ou refresh da página.
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