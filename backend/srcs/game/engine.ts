import { WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
//Pixels per second
const PADDLE_SPEED = 300;
const BALL_SPEED = 300;
const WINNING_SCORE = 4;

// Represents a player connected to a session
export class Player {
	id: string;
	name: string;
	ws: WebSocket;
	color: string;
	x: number;
	y: number;
	width: number = PADDLE_WIDTH;
	height: number = PADDLE_HEIGHT;
	score: number = 0;
	touches: number = 0;
	moveUp: boolean = false;
	moveDown: boolean = false;

	constructor(id: string, name: string, ws: WebSocket, side: 'left' | 'right', color: string) {
		this.id = id;
		this.name = name;
		this.ws = ws;
		this.color = color;
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
	background: string;
	prisma: PrismaClient;
	private gameInterval: NodeJS.Timeout | null = null;
	private lastTime: number = 0;


	constructor(sessionId: string, background: string, prisma: PrismaClient) {
		this.sessionId = sessionId;
		this.background = background;
		this.prisma = prisma;
		this.ball = new Ball();
	}

	addPlayer(player: Player) {
		if (this.players.length < 2) {
			this.players.push(player);
		}
	}

	// Inicia o loop do jogo
	start() {
		if (this.players.length !== 2) 
			return;

		const player1 = this.players[0];
		const player2 = this.players[1];

		//DEBUG - NAO EXCLUIR AINDA
		console.log(`[GameSession ${this.sessionId}] Iniciando jogo. Notificando ambos os jogadores.`);
		console.log(`---> PREPARANDO PARA ENVIAR 'gameStart' PARA O GUEST (${player2.id}) COM BACKGROUND: ${this.background}`);

		//ISSO PODE SER REFATORADO PARA UM PAYLOAD. MAS VAI TER DE MUDAR MUITA COISA QUE CHATO PORRA
		player1.ws.send(JSON.stringify({
			type: 'gameStart',
			opponentId: player2.id,
			p1Name: player1.name,
			p2Name: player2.name,
			background: this.background
		}));
		//ISSO PODE SER REFATORADO PARA UM PAYLOAD. MAS VAI TER DE MUDAR MUITA COISA QUE CHATO PORRA
		player2.ws.send(JSON.stringify({
			type: 'gameStart',
			opponentId: player1.id,
			p1Name: player1.name,
			p2Name: player2.name,
			background: this.background
		}));

		this.lastTime = Date.now();
		//SUSPEITO QUE O TRAVAMENTO POSSA ESTAR RELACIONADO A ISSO AQUI
		//MAS O ROBO NAO ME AJUDA A RESOLVER ESSA PORRA
		this.gameInterval = setInterval(() => this.update(), 1000 / 60); //AQUI MUDA A QUANTIDADE DE FRAMES POR SEGUNDO
	}

	stop() {
		if (this.gameInterval) {
			clearInterval(this.gameInterval);
			this.gameInterval = null;
		}
	}

	// O coração do jogo! Chamado 60x por segundo
	private update() {
		const now = Date.now();
		const deltaTime = (now - this.lastTime) / 1000;
		this.lastTime = now;

		this.players.forEach(player => {
			if (player.moveUp && player.y > 0) {
				player.y -= PADDLE_SPEED * deltaTime;
			}
			if (player.moveDown && player.y < CANVAS_HEIGHT - player.height) {
				player.y += PADDLE_SPEED * deltaTime;
			}
		});

		this.ball.x += this.ball.speedX * deltaTime;
		this.ball.y += this.ball.speedY * deltaTime;

		this.checkCollisions();
		this.checkWinCondition();
		this.broadcastState();
	}

	private checkCollisions() {
		const p1 = this.players[0];
		const p2 = this.players[1];

		// colisão com as bordas de cima e baixo
		if (this.ball.y - this.ball.size < 0 || this.ball.y + this.ball.size > CANVAS_HEIGHT) {
			this.ball.speedY *= -1;
		}

		// colisão com player1
		if (
			this.ball.speedX < 0 &&
			this.ball.x - this.ball.size < p1.x + p1.width &&
			this.ball.x + this.ball.size > p1.x &&
			this.ball.y + this.ball.size > p1.y &&
			this.ball.y - this.ball.size < p1.y + p1.height
		) {
			this.ball.x = p1.x + p1.width + this.ball.size;
			p1.touches++;

			const hitPos = (this.ball.y - (p1.y + p1.height / 2)) / (p1.height / 2);
			const angle = hitPos * (Math.PI / 4); // máx 45°

			this.ball.speedX = Math.cos(angle) * BALL_SPEED; // positivo = direita
			this.ball.speedY = Math.sin(angle) * BALL_SPEED;
		}

		// colisão com player2
		if (
			this.ball.speedX > 0 &&
			this.ball.x + this.ball.size > p2.x &&
			this.ball.x - this.ball.size < p2.x + p2.width &&
			this.ball.y + this.ball.size > p2.y &&
			this.ball.y - this.ball.size < p2.y + p2.height
		) {
			this.ball.x = p2.x - this.ball.size;
			p2.touches++;

			const hitPos = (this.ball.y - (p2.y + p2.height / 2)) / (p2.height / 2);
			const angle = hitPos * (Math.PI / 4);

			this.ball.speedX = -Math.cos(angle) * BALL_SPEED; // negativo = esquerda
			this.ball.speedY = Math.sin(angle) * BALL_SPEED;
		}

		// pontos
		if (this.ball.x < 0) {
			p2.score++;
			console.log(`PONTO PARA P2! Placar: P1 ${p1.score} - P2 ${p2.score}`);
			this.ball.reset();
		} else if (this.ball.x > CANVAS_WIDTH) {
			p1.score++;
			console.log(`PONTO PARA P1! Placar: P1 ${p1.score} - P2 ${p2.score}`);
			this.ball.reset();
		}
	}
		
	private async saveGameData() {
		const players = this.players;

		try {
			const match = await this.prisma.match.create({
			data: {
				date: new Date(),
				matchParticipant: {
				create: players.map(p => {
					return {
						user: { connect: { username: p.name } },
						goals: p.score,
						touches: p.touches,
					};
				}),
				},
			},
			include: {
				matchParticipant: {
				include: { user: true },
				},
			},
			});

			console.log(`[GameSession ${this.sessionId}] Partida registrada com sucesso`);
		} catch (error) {
			console.error(`Erro ao registrar a partida:`, error);
		}
	}

	private async checkWinCondition() {
		const p1 = this.players[0];
		const p2 = this.players[1];
		let winner: Player | null = null;

		if (p1.score >= WINNING_SCORE) {
			winner = p1;
		} else if (p2.score >= WINNING_SCORE) {
			winner = p2;
		}

		if (winner) {
			//ISSO TEM DE SER MUDADO PARA INGLES
			//console.log(`[GameSession ${this.sessionId}] Fim de jogo! Vencedor: Jogador com ID ${winner.id}`);
			console.log("Fez o ultimo broadcast");
			this.broadcastState();
			await new Promise(resolve => setTimeout(resolve, 100));
			
			this.saveGameData();
			this.stop();
			this.broadcast({
				type: 'gameOver',
				payload: {
					winnerName: winner.name,
				}
			});
		}
	}


	// Envia o estado atual para todos os jogadores na sessão
	//suspeito que o fato de nao enviar o placar correto seja por que o jogo acaba antes de chegar aqui
	//reitero, isso é só uma suspeita
	private broadcastState() {
		if (this.players.length < 2) 
			return;

		const state = {
			type: 'gameStateUpdate',
			payload: {
				ball: { 
					x: this.ball.x, 
					y: this.ball.y 
				},
				paddles: this.players.map(p => ({ 	id: p.id, 
													x: p.x, 
													y: p.y, 
													color: p.color 
												})),
				scores: { 
					p1: this.players[0].score, 
					p2: this.players[1].score 
				}
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

		if (playerIndex === 0) {
			if (data.key === 'w') {
				player.moveUp = isKeyDown;
			}
			else if (data.key === 's') {
				player.moveDown = isKeyDown;
			}
		} else {
			if (data.key === 'ArrowUp')
				player.moveUp = isKeyDown;
			else if (data.key === 'ArrowDown')
				player.moveDown = isKeyDown;
		}
	}

	removePlayer(playerId: string) {
		const leavingPlayer = this.players.find(p => p.id === playerId);
		if (!leavingPlayer) return;

		this.stop();

		// Avisa o jogador que ficou que o oponente saiu
		const remainingPlayer = leavingPlayer.getPlayerOpponent(this.players);
		if (remainingPlayer) {
			const message = { type: 'opponentLeft' };
			remainingPlayer.ws.send(JSON.stringify(message));
		}

		this.players = this.players.filter(p => p.id !== playerId);
		console.log(`[GameSession ${this.sessionId}] Jogador ${playerId} removido. Jogadores restantes: ${this.players.length}`);
	}
}