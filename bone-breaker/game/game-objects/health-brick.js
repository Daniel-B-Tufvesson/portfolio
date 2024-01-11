import { Brick } from "./brick.js";
import { BrokenBrick } from "./broken-brick.js";
import { randomRange } from "../utility.js";
import { Vector } from "../vector.js";

export class HealthBrick extends Brick {

    constructor() {
        super()
        this.sprite = new Image()
        this.sprite.src = './images/brick health.png'
    }


    breakBrick() {
        this.engine.score += this.score

        // Spawn falling heart.
        const fallingHeart = new FallingHeart()
        fallingHeart.position.setXY(
            this.position.x + this.size.x / 2 - fallingHeart.size.x / 2,
            this.position.y + this.size.y / 2 - fallingHeart.size.y / 2
        )
        fallingHeart.velocity = new Vector(0, -100).rotated(randomRange(-1, 1))
        this.engine.addBrokenBrick(fallingHeart)
        
        this.engine.removeBrick(this)
    }
}


export class FallingHeart extends BrokenBrick {

    constructor() {
        super()
        this.rotationVelocity = 0
        this.sprite = new Image()
        this.sprite.src = './images/heart.png'
        this.size.setXY(16, 16)
    }

    /**
     * Increment health when touching paddle.
     */
    collideWithPaddle() {
        this.engine.health++
        this.engine.removeBrokenBrick(this)
    }
}