export class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    score: number;
    color: string;

    constructor(x: number, y: number, width: number, height: number, speed: number, color: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.score = 0;
        this.color = color;
    }


    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}