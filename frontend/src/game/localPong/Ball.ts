export class Ball {
    initialX: number;
    initialY: number;
    x: number;
    y: number;
    increase: number
    size: number;
    speed: number;
    speedX: number;
    speedY: number;
    canvas: HTMLCanvasElement;

    constructor(x: number, y: number, size: number, speed: number, canvas: HTMLCanvasElement, increase: number) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.increase = increase;
        this.size = size;
        this.speed = speed;
        this.speedX = -speed;
        this.speedY = 0;
        this.canvas = canvas;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update(deltaTime: number) {
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;
    
        if (this.y - this.size < 0) {
        this.speedY *= -1;
        this.y = this.size;
        } 
        
        else if (this.y + this.size > this.canvas.height) {
            this.speedY *= -1;
            this.y = this.canvas.height - this.size;
        }
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.speedX *= -1;
        this.speedY = 0;

        const originalSpeedX = this.speedX;
        const originalSpeedY = this.speedY;
        this.speedX = 0;
        this.speedY = 0;
        
        setTimeout(() => {
            this.speedX = originalSpeedX;
            this.speedY = originalSpeedY;
        }, 1000);
    }
}
