import { randomRange } from "../utility.js";
import { Ball, DEFAULT_SPEED } from "./ball.js";
import { Brick } from "./brick.js";

export class BallSpawnerBrick extends Brick {

    ballsToSpawn = 3

    constructor() {
        super()
        this.score = 100
        this.sprite = new Image()
        this.sprite.src = './images/brick ball spawner.png'
    }

    breakBrick() {
        this.engine.score += this.score

        // Spawn more balls.
        for (let i = 0; i < this.ballsToSpawn; i++) {
            const ball = new Ball()
            ball.position.setXY(
                this.position.x + this.size.x / 2,
                this.position.y + this.size.y / 2
            )

            // Set random velocity.
            ball.velocity.setXY(DEFAULT_SPEED, 0).rotate(randomRange(0, Math.PI * 2))

            this.engine.addBall(ball)
            console.log('spawn ball!!')
        }

        this.engine.removeBrick(this)
    }
}