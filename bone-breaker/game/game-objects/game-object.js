import { Engine } from "../engine.js"
import { Vector } from "../vector.js"

/**
 * A base class for all game objects in the game.
 */
export class GameObject {

    position = new Vector()
    size = new Vector()
    velocity = new Vector()
    rotation = 0
    rotationVelocity = 0
    sprite = null

    /**@type {Engine} */
    engine = null

    constructor() {
        // Empty constructor for now.   
    }

    /**
     * Update the behavior of the game object, e.g. its physics.
     * @param {number} deltaTime - the time in seconds since the previous game update.
     */
    update(deltaTime) {

        this.position.x += this.velocity.x * deltaTime
        this.position.y += this.velocity.y * deltaTime

        this.rotation += this.rotationVelocity * deltaTime
    }

    /**
     * Draw this object. By default this will draw the sprite (if set). 
     * @param {CanvasRenderingContext2D} ctx - a rendering context used for drawing objects.
     */
    draw(ctx) {
        if (this.sprite !== null) {
            ctx.drawImage(this.sprite, this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }

}