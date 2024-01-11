import { GameObject } from "./game-object.js";
import { Paddle } from "./paddle.js";

export class BrokenBrick extends GameObject {

    hasHitPaddle = false

    constructor() {
        super()
        this.sprite = new Image()
        this.sprite.src = './images/broken brick bone.png'
        this.rotationVelocity = 3
    }

    /**
     * Draw the broken brick.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {

        // Keep around for debug.
        /*
        ctx.fillStyle = 'lightgray'
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x + 1, this.position.y + 1, this.size.x - 2, this.size.y - 2);
        */

        // Transform the context.
        const offsetX = this.size.x / 2
        const offsetY = this.size.y / 2
        const x = this.position.x + offsetX
        const y = this.position.y + offsetY
        ctx.translate(x, y)
        ctx.rotate(this.rotation)

        // Draw sprite.
        ctx.drawImage(this.sprite, -offsetX, -offsetY, this.size.x, this.size.y);

        // Restore transform.
        ctx.rotate(-this.rotation)
        ctx.translate(-x, -y)
    }

    update(deltaTime) {
        super.update(deltaTime)

        // Apply gravity.
        this.velocity.y += 100 * deltaTime

        // Check collision with paddle.
        if (!this.hasHitPaddle) {
            this.checkCollisionWithPaddle(this.engine.paddle)

            // Abort the logic update if collision has removed brick from engine.
            if (this.engine === null) {
                return
            }
        }

        // Check collision with walls.
        this.checkCollisionWithWalls()

        // Remove brick if fallen outside game.
        if (this.position.y > this.engine.$canvas.height) {
            this.engine.removeBrokenBrick(this)
        }
    }

    /**
     * Check and handle any collisions with the paddle.
     * @param {Paddle} paddle - the paddle to check collisions with.
     */
    checkCollisionWithPaddle(paddle) {

        if (this.position.x + this.size.x >= paddle.position.x &&
            this.position.x <= paddle.position.x + paddle.size.x &&
            this.position.y + this.size.y >= paddle.position.y &&
            this.position.y <= paddle.position.y + paddle.size.y) {

            this.hasHitPaddle = true
            this.collideWithPaddle()
        }
    }

    collideWithPaddle() {
        this.engine.takeDamage()
    }


    checkCollisionWithWalls() {
        const leftEdge = 0
        const rightEdge = this.engine.$canvas.width

        // Check and bounce on right edge.
        if (this.position.x + this.size.x >= rightEdge && this.velocity.x > 0) {
            this.velocity.x *= -1
        }

        // Check and bounce on left edge.
        else if(this.position.x  <= leftEdge && this.velocity.x < 0) {
            this.velocity.x *= -1
        }
    }
}