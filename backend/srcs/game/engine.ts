// backend/srcs/game/engine.ts
import { WebSocket } from 'ws';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
//Pixels per second
const PADDLE_SPEED = 300;
const BALL_SPEED = 300;

// Represents a player connected to a session
export class Player {
	id: string;
	ws: WebSocket;
	x: number;
	y: number;
	width: number = PADDLE_WIDTH;
	height: number = PADDLE_HEIGHT;
	score: number = 0;
	moveUp: boolean = false;
	moveDown: boolean = false;

	constructor(id: string, ws: WebSocket, side: 'left' | 'right') {
		this.id = id;
		this.ws = ws;
		this.x = (side === 'left') ? PADDLE_WIDTH : CANVAS_WIDTH - (PADDLE_WIDTH * 2);
		this.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
	}

	getPlayerOpponent(players: Player[]): Player | undefined {
		return players.find((p) => p.id !== this.id);
	}
}

export class Ball {
	x!: number;
	y!: number;
	size: number = BALL_SIZE;
	speedX!: number;
	speedY!: number;

	constructor() {
		this.reset();
	}

	// Put BALL in the center with random direction
	reset() {
		this.x = CANVAS_WIDTH / 2;
		this.y = CANVAS_HEIGHT / 2;
		const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
		this.speedX = BALL_SPEED * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
		this.speedY = BALL_SPEED * Math.sin(angle);
	}
}

// REMOTE GAME ENGINE
export class GameSession {
	sessionId: string;
	players: Player[] = [];
	ball: Ball;
	private gameInterval: NodeJS.Timeout | null = null;
	private lastTime: number = 0;

	constructor(sessionId: string) {
		this.sessionId = sessionId;
		this.ball = new Ball();
	}

	addPlayer(player: Player) {
		if (this.players.length < 2) {
			this.players.push(player);
		}
	}

	// Inicia o loop do jogo
	start() {
		if (this.players.length !== 2) return; // Só começa com 2 jogadores

		const player1 = this.players[0]; // Host
        const player2 = this.players[1]; // Guest

		console.log(`[GameSession ${this.sessionId}] Iniciando jogo. Notificando ambos os jogadores.`);

		player1.ws.send(JSON.stringify({
            type: 'gameStart',
            opponentId: player2.id
        }));

        // Envia a mensagem para o Player 2 com o ID do oponente correto
        player2.ws.send(JSON.stringify({
            type: 'gameStart',
            opponentId: player1.id
        }));

		this.broadcast({ type: 'gameStart', opponentId: this.players[1].id });
		this.lastTime = Date.now();
		this.gameInterval = setInterval(() => this.update(), 1000 / 60); // 60 updates por segundo
	}

	// Para o loop do jogo
	stop() {
		if (this.gameInterval) {
			clearInterval(this.gameInterval);
			this.gameInterval = null;
		}
	}

	// O coração do jogo! Chamado 60x por segundo
	private update() {
		const now = Date.now();
		const deltaTime = (now - this.lastTime) / 1000; // Delta time em segundos
		this.lastTime = now;

		// 1. Mover os paddles
		this.players.forEach(player => {
			if (player.moveUp && player.y > 0) {
				player.y -= PADDLE_SPEED * deltaTime;
			}
			if (player.moveDown && player.y < CANVAS_HEIGHT - player.height) {
				player.y += PADDLE_SPEED * deltaTime;
			}
		});

		// 2. Mover a bola
		this.ball.x += this.ball.speedX * deltaTime;
		this.ball.y += this.ball.speedY * deltaTime;

		// 3. Verificar colisões
		this.checkCollisions();

		// 4. Enviar o novo estado para os jogadores
		this.broadcastState();
	}

	private checkCollisions() {
		const p1 = this.players[0];
		const p2 = this.players[1];

		// Colisão com paredes (cima/baixo)
		if (this.ball.y - this.ball.size < 0 || this.ball.y + this.ball.size > CANVAS_HEIGHT) {
			this.ball.speedY *= -1;
		}

		// Colisão com paddles
		if (this.ball.x - this.ball.size < p1.x + p1.width && this.ball.y > p1.y && this.ball.y < p1.y + p1.height) {
			this.ball.speedX *= -1;
			this.ball.x = p1.x + p1.width + this.ball.size; // Evitar que a bola entre no paddle
		}
		if (this.ball.x + this.ball.size > p2.x && this.ball.y > p2.y && this.ball.y < p2.y + p2.height) {
			this.ball.speedX *= -1;
			this.ball.x = p2.x - this.ball.size;
		}

		// Pontuação
		if (this.ball.x < 0) {
			p2.score++;
			this.ball.reset();
		} else if (this.ball.x > CANVAS_WIDTH) {
			p1.score++;
			this.ball.reset();
		}
	}

	// Envia o estado atual para todos os jogadores na sessão
	private broadcastState() {
        // Garante que só envia o estado se tivermos ambos os jogadores
        if (this.players.length < 2) return;

        const state = {
            type: 'gameStateUpdate',
            payload: { // <<< Envolvemos o estado num 'payload' para consistência
                ball: { x: this.ball.x, y: this.ball.y },
                paddles: this.players.map(p => ({ id: p.id, x: p.x, y: p.y })),
                scores: { p1: this.players[0].score, p2: this.players[1].score }
            }
        };
        this.broadcast(state);
    }

	 // Função utilitária para enviar uma mensagem para ambos os jogadores
    private broadcast(message: object) {
        const msgString = JSON.stringify(message);
        this.players.forEach(player => {
            // Verificação de segurança para só enviar se a conexão estiver aberta
            if (player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(msgString)
            }
        });
    }

	handlePlayerMove(playerId: string, data: { key: 'w' | 's' | 'ArrowUp' | 'ArrowDown'; keyState: 'keydown' | 'keyup' }) {
		const player = this.players.find(p => p.id === playerId);
		if (!player) return;

		// Usamos a propriedade renomeada 'keyState'
		const isKeyDown = data.keyState === 'keydown';

		const playerIndex = this.players.indexOf(player);

		if (playerIndex === 0) { // Player 1
			if (data.key === 'w') {
				player.moveUp = isKeyDown;
			}
			else if (data.key === 's') {
				player.moveDown = isKeyDown;
			}
		} else { // Player 2
			if (data.key === 'ArrowUp')
				player.moveUp = isKeyDown;
			else if (data.key === 'ArrowDown')
				player.moveDown = isKeyDown;
		}
	}

	removePlayer(playerId: string) {
		const leavingPlayer = this.players.find(p => p.id === playerId);
		if (!leavingPlayer) return;

		this.stop(); // Para o loop do jogo

		// Avisa o jogador que ficou que o oponente saiu
		const remainingPlayer = leavingPlayer.getPlayerOpponent(this.players);
		if (remainingPlayer) {
			const message = { type: 'opponentLeft' };
			remainingPlayer.ws.send(JSON.stringify(message));
		}

		// Remove o jogador que saiu da lista
		this.players = this.players.filter(p => p.id !== playerId);
		console.log(`[GameSession ${this.sessionId}] Jogador ${playerId} removido. Jogadores restantes: ${this.players.length}`);
	}
}