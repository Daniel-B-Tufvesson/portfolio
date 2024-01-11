import { BrokenBrick } from "./broken-brick.js";
import { GameObject } from "./game-object.js";
import { Vector } from "../vector.js";

export class Brick extends GameObject {

    health = 1
    score = 10

    constructor() {
        super()
        this.size.x = 50
        this.size.y = 20
        this.sprite = new Image()
        this.sprite.src = './images/brick bone.png'
    }

    /**
     * Break the brick.
     */
    breakBrick() {
        this.engine.score += this.score

        // Spawn left broken brick.
        this.spawnBrokenBrick(
            this.position.x,
            this.position.y,
            0,
            -4,
            new Vector(-10, -50)
        )

        // Spawn right broken brick.
        this.spawnBrokenBrick(
            this.position.x + this.size.x / 2,
            this.position.y,
            Math.PI,
            4,
            new Vector(10, -50)
        )

        this.engine.removeBrick(this)
    }


    spawnBrokenBrick(x, y, rotation, rotationVelocity, velocity) {
        console.log('spawn brock')
        
        const brokenBrick = new BrokenBrick()
        brokenBrick.size.setXY(this.size.x / 2, this.size.y)
        brokenBrick.position.setXY(x, y)
        brokenBrick.velocity.set(velocity)
        brokenBrick.rotation = rotation
        brokenBrick.rotationVelocity = rotationVelocity
        this.engine.addBrokenBrick(brokenBrick)
    }


    /**
     * Hit the brick and subtract its life. Brick is broken if health reaches zero.
     */
    hitBrick() {
        this.health -= 1

        // Break brick if health reaches zero.
        if (this.health <= 0) {
            this.breakBrick()
        }
    }


    /*
    draw(ctx) {
        ctx.fillStyle = 'lightgray'
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x + 1, this.position.y + 1, this.size.x - 2, this.size.y - 2);
    }
    */
}