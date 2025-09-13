import { WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';
import { Ball } from './entities/Ball';
import { Player } from './entities/Player';
import { hasOnlyExpressionInitializer } from 'typescript';


export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;
export const BALL_SPEED = 300;
export const BALL_SIZE = 10;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 100;

const PADDLE_SPEED = 300;
const SPEED_INCREASED = 20;
const WINNING_SCORE = 4;

//This class represents the remote game ression
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

	start() {
		if (this.players.length !== 2)
			return;

		const player1 = this.players[0];
		const player2 = this.players[1];

		player1.ws.send(JSON.stringify({
			type: 'gameStart',
			opponentId: player2.id,
			p1Name: player1.name,
			p2Name: player2.name,
			background: this.background
		}));

		player2.ws.send(JSON.stringify({
			type: 'gameStart',
			opponentId: player1.id,
			p1Name: player1.name,
			p2Name: player2.name,
			background: this.background
		}));

		this.lastTime = Date.now();
		this.gameInterval = setInterval(() => this.update(), 1000 / 60);
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

		if (this.ball.y - this.ball.size < 0) {
			this.ball.speedY *= -1;
			this.ball.y = this.ball.size;
		}
		else if (this.ball.y + this.ball.size > CANVAS_HEIGHT) {
			this.ball.speedY *= -1;
			this.ball.y = CANVAS_HEIGHT - this.ball.size;
		}


		if (
			this.ball.speedX < 0 &&
			this.ball.x - this.ball.size < p1.x + p1.width &&
			this.ball.x + this.ball.size > p1.x &&
			this.ball.y + this.ball.size > p1.y &&
			this.ball.y - this.ball.size < p1.y + p1.height
		) {
			this.ball.x = p1.x + p1.width + this.ball.size;
			p1.touches++;

			this.ball.speed += SPEED_INCREASED;
			const hitPos = (this.ball.y - (p1.y + p1.height / 2)) / (p1.height / 2);
			const angle = hitPos * (Math.PI / 4);

			this.ball.speedX = Math.cos(angle) * this.ball.speed;
			this.ball.speedY = Math.sin(angle) * this.ball.speed;
		}

		if (
			this.ball.speedX > 0 &&
			this.ball.x + this.ball.size > p2.x &&
			this.ball.x - this.ball.size < p2.x + p2.width &&
			this.ball.y + this.ball.size > p2.y &&
			this.ball.y - this.ball.size < p2.y + p2.height
		) {
			this.ball.x = p2.x - this.ball.size;
			p2.touches++;

			this.ball.speed += SPEED_INCREASED;
			const hitPos = (this.ball.y - (p2.y + p2.height / 2)) / (p2.height / 2);
			const angle = hitPos * (Math.PI / 4);

			this.ball.speedX = -Math.cos(angle) * this.ball.speed;
			this.ball.speedY = Math.sin(angle) * this.ball.speed;
		}

		if (this.ball.x < 0) {
			p2.score++;
			this.ball.reset();
		} else if (this.ball.x > CANVAS_WIDTH) {
			p1.score++;
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
		} catch (error) {
			console.error(`Error registering match:`, error);
		}
	}

	private checkWinCondition() {
		const p1 = this.players[0];
		const p2 = this.players[1];
		let winner: Player | null = null;

		if (p1.score >= WINNING_SCORE) {
			winner = p1;
		} else if (p2.score >= WINNING_SCORE) {
			winner = p2;
		}

		if (winner) {
			this.broadcastState();
			this.stop();
			setTimeout(() => {
				this.broadcast({
					type: 'gameOver',
					payload: {
						winnerName: winner.name,
					}
				});
				this.players.forEach(player => {
					player.ws.close(1000, 'Game Over');
				});
			}, 100);
			this.saveGameData();

		}
	}

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
				paddles: this.players.map(p => ({
					id: p.id,
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

	private broadcast(message: object) {
		const msgString = JSON.stringify(message);
		this.players.forEach(player => {
			if (player.ws.readyState === WebSocket.OPEN) {
				player.ws.send(msgString)
			}
		});
	}

	handlePlayerMove(playerId: string, data: { key: 'w' | 's' | 'ArrowUp' | 'ArrowDown'; keyState: 'keydown' | 'keyup' }) {
		const player = this.players.find(p => p.id === playerId);
		if (!player)
			return;

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
		const remainingPlayer = leavingPlayer.getPlayerOpponent(this.players);
		if (remainingPlayer) {
			const message = { type: 'opponentLeft' };
			remainingPlayer.ws.send(JSON.stringify(message));
		}

		this.players = this.players.filter(p => p.id !== playerId);
	}
}