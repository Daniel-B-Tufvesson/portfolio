import { Brick } from "./brick.js";
import { GameObject } from "./game-object.js";
import { Vector } from "../vector.js";

export const DEFAULT_SPEED = 300
export const DEFAULT_ROTATION_VEL = 5

export class Ball extends GameObject {

    radius = 10

    constructor() {
        super()
        this.sprite = new Image()
        this.sprite.src = './images/ball skull.png'
        this.size.setXY(22, 35)
        this.rotationVelocity = DEFAULT_ROTATION_VEL
    }

    /**
     * Draw the ball.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = "lightgray"
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Transform the context.
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotation)

        // Draw sprite.
        const offsetX = -this.size.x / 2
        const offsetY = -this.size.y / 2
        ctx.drawImage(this.sprite, offsetX, offsetY, this.size.x, this.size.y);

        // Restore transform.
        ctx.rotate(-this.rotation)
        ctx.translate(-this.position.x, -this.position.y)
    }


    /**
     * Update the ball's behavior. 
     * @param {number} deltaTime
     */
    update(deltaTime) {
        super.update(deltaTime)
        this.checkCollisionWithEdges()

        // Check collision with each brick.
        const bricks = this.engine.bricks
        for (let i = bricks.length - 1; i >= 0; i--) {
            if (this.checkCollisionWithBrick(bricks[i])) {
                break
            }
        }

        this.checkFallenOutsideGame()
    }

    /**
     * Check if this ball is colliding with the given brick. If so, the ball will bounce
     * and damage the brick.
     * @param {Brick} brick the brick to check.
     * @returns true if collision has occurred.
     */
    checkCollisionWithBrick(brick) {

        const collisionPoint = this.isCollidingWithRect(brick)
        if (collisionPoint !== null) {
            brick.hitBrick()

            this.bounceOnPoint(collisionPoint)  
            return true
        }
        else {
            return false
        }
    }


    /**
     * Check if this ball is overlapping with a rectangular game object.
     * @param {GameObject} rect a game object which is assumed to be a rectangle.
     * @returns a Vector2 of the point of contact, or null if they are not overlapping.
     */
    isCollidingWithRect(rect) {
        // Parts of this approach is taken from Jeffrey Thompson. Collision Detection: Circle/Rectangle.
        // https://www.jeffreythompson.org/collision-detection/circle-rect.php.
        // retrieved (01-01-2024).

        // Compute the potential collision point.
        const point = new Vector(this.position.x, this.position.y)

        // Check collision with left edge of rect.
        if (this.position.x <= rect.position.x) {
            point.x = rect.position.x
        }
        // Check collision with right edge of rect.
        else if(this.position.x >= rect.position.x + rect.size.x) {
            point.x = rect.position.x + rect.size.x
        }

        // Check collision with bottom edge of rect.
        if (this.position.y >= rect.position.y + rect.size.y) {
            point.y = rect.position.y + rect.size.y
        }
        // Check collision with top edge of rect.
        else if (this.position.y <= rect.position.y) {
            point.y = rect.position.y
        }


        // Check if ball is moving away from contact point. We do this to prevent the
        // ball from potentially getting stuck in the colliding rect.
        // Calculate relative velocity.
        const relVel = new Vector(
            this.velocity.x - rect.velocity.x,
            this.velocity.y - rect.velocity.y
        )

        // Direction from ball towards the contact point.
        const toRect = new Vector(
            point.x - this.position.x,
            point.y - this.position.y
        )

        // Collision should not occur if object is moving away from contact point.
        // A negative dot product indicates that they are moving away from each other.
        // (A positive indicates they are moving towards each other.)
        if (toRect.dot(relVel) < 0) {
            return null
        }

        // Collision occurs if the test point occurs within the ball's radius.
        const distance = this.position.dist(point.x, point.y)
        if (distance <= this.radius) {
            // Collision occurred, return the collision point.
            return point
        }
        else {
            // No collision occurred. Return null.
            return null
        }
    }

    /**
     * Bounce on the given point.
     * @param {Vector} point the point to bounce on. 
     */
    bounceOnPoint(point) {
        // Math taken from stackexchange answer by Phrogz. How to get a reflection vector?.
        // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector.
        // retrieved (01-01-2024).
        let norm = new Vector(this.position.x - point.x, this.position.y - point.y).normed()
        const dot = this.velocity.dot(norm)
        norm = norm.scaled(2 * dot)
        this.velocity.x = this.velocity.x - norm.x
        this.velocity.y = this.velocity.y - norm.y
    }


    /**
     * Check and handle collision with edges. 
     */
    checkCollisionWithEdges() {
        const leftEdge = 0
        const rightEdge = this.engine.$canvas.width
        const topEdge = 0

        // Check and bounce on right edge.
        if (this.position.x + this.radius >= rightEdge && this.velocity.x > 0) {
            this.velocity.x *= -1
        }

        // Check and bounce on left edge.
        else if(this.position.x - this.radius  <= leftEdge && this.velocity.x < 0) {
            this.velocity.x *= -1
        }

        

        // Check and bounce on top edge.
        else if (this.position.y - this.radius <= topEdge && this.velocity.y < 0) {
            this.velocity.y *= -1
        }
    }

    /**
     * Check and remove the ball if it's below the bottom edge of the game.
     */
    checkFallenOutsideGame() {
        const bottomEdge = this.engine.$canvas.height

        // Remove ball if it's fully below the bottom edge.
        if (this.position.y - this.radius >= bottomEdge && this.velocity.y > 0) {
            this.engine.removeBall(this)
        }
    }
}