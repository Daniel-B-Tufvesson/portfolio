import { approach, randomRange } from "../utility.js";
import { GameObject } from "./game-object.js";
import { Ball, DEFAULT_ROTATION_VEL, DEFAULT_SPEED } from "./ball.js";

export const DIRECTION_LEFT = -1
export const DIRECTION_RIGHT = 1

export class Paddle extends GameObject {
    
    accelerationX = 4000
    maxSpeedX = 500
    moveDirection = 0

    /**@type {Ball} */
    holdingBall = null

    constructor(engine) {
        super()
        this.engine = engine
        this.size.setXY(90, 10)
    }


    draw(ctx) {
        ctx.fillStyle = 'lightgray'
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x + 1, this.position.y + 1, this.size.x - 2, this.size.y - 2);
    }

    update(deltaTime) {
        super.update(deltaTime)
        this.move(deltaTime)
        this.checkCollisionWithEdges()

        // Handle collision with all balls.
        this.engine.balls.forEach(ball => {

            // Don't collide with ball which is being held.
            if (this.holdingBall !== ball) {
                this.checkCollisionWithBall(ball)
            }
        })

        // Update the position of the ball which is being held.
        if (this.holdingBall != null) {
            this.holdBall()
        }
    }

    /**
     * Move the paddle either left or right.
     * @param {number} deltaTime 
     */
    move(deltaTime) {
        let targetSpeed = this.moveDirection * this.maxSpeedX
        this.velocity.x = approach(this.velocity.x, targetSpeed, 
            this.accelerationX * deltaTime)
    }

    /**
     * Check collision with the given ball and bounce if it collides.
     * @param {Ball} ball 
     */
    checkCollisionWithBall(ball) {

        const collisionPoint = ball.isCollidingWithRect(this)
        if (collisionPoint !== null) {
            ball.bounceOnPoint(collisionPoint)

            // Randomly rotate the velocity vector to introduce some noise.
            ball.velocity.rotate(randomRange(-0.1, 0.1))
        }
    }

    /**
     * Check collision with left and right edges and prevent paddle from moving outside.
     */
    checkCollisionWithEdges() {
        const leftEdge = 0
        const rightEdge = this.engine.$canvas.width

        // Check left edge.
        if (this.position.x <= leftEdge && this.velocity.x < 0) {
            this.velocity.x = 0
            this.position.x = leftEdge
        }

        // Check right edge.
        else if (this.position.x + this.size.x >= rightEdge && this.velocity.x > 0) {
            this.velocity.x = 0
            this.position.x = rightEdge - this.size.x
        }
    }

    /**
     * Launch the ball that is being currently held.
     */
    launchBall() {
        this.holdingBall.velocity.setXY(0, -DEFAULT_SPEED).rotate(randomRange(-0.2, 0.2))
        this.holdingBall.rotationVelocity = DEFAULT_ROTATION_VEL
        this.holdingBall = null;
    }

    /**
     * Update the ball's position when holding it.
     */
    holdBall() {
        this.holdingBall.position.setXY(
            this.position.x + this.size.x / 2,
            this.position.y - this.holdingBall.size.y / 2
        )
        this.holdingBall.velocity.setXY(0, 0)
        this.holdingBall.rotationVelocity = 0
    }

    /**
     * Grab hold of the ball.
     */
    grabBall(ball) {
        this.holdingBall = ball
        this.holdBall()
    }
}

