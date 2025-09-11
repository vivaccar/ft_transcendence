import { CANVAS_HEIGHT, CANVAS_WIDTH, BALL_SIZE, BALL_SPEED } from "../engine";

export class Ball {
	x!: number;
	y!: number;
	size: number = BALL_SIZE;
	speedX!: number;
	speedY!: number;
	speed: number;

	constructor() {
		this.speed = BALL_SPEED;
		this.reset();
	}

	reset() {
		this.x = CANVAS_WIDTH / 2;
		this.y = CANVAS_HEIGHT / 2;
		const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
		this.speedX = BALL_SPEED * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
		this.speedY = BALL_SPEED * Math.sin(angle);
		this.speed = BALL_SPEED;
	}
}