export class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    score: number;
    touches: number;
    color: string;
    name: string;

    constructor(x: number, y: number, width: number, height: number, speed: number, color: string, name: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.score = 0;
        this.touches = 0;
        this.color = color;
        this.name = name
    }


    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}