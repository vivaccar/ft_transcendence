import { PADDLE_HEIGHT, PADDLE_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH } from "../engine";

//Player entity is represent as paddle too.
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