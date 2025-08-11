export class Ball {
    initialX: number;
    initialY: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    canvas: HTMLCanvasElement;

    constructor(x: number, y: number, size: number, speed: number, canvas: HTMLCanvasElement) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speed;
        this.speedY = speed;
        this.canvas = canvas;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y - this.size < 0 || this.y + this.size > this.canvas.height) {
            this.speedY *= -1;
        }
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.speedX *= -1;
        this.speedY = (Math.random() > 0.5 ? 1 : -1) * Math.abs(this.speedX);
    }
}
