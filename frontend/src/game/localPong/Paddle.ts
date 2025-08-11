export class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    score: number;

    constructor(x: number, y: number, width: number, height: number, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.score = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}