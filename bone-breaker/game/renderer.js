import { Engine } from "./engine.js"
import { randomRange } from "./utility.js"

/**
 * The renderer renders the game objects in the game engine.
 */
export class Renderer {

    timeShake = -9999

    /**
     * 
     * @param {Engine} engine 
     * @param {HTMLCanvasElement} $canvas 
     */
    constructor(engine, $canvas) {
        this.engine = engine
        this.$canvas = $canvas

        this.ctx = $canvas.getContext("2d")
        this.originalTransform = this.ctx.getTransform()

        this.background = new Image()
        this.background.src = './images/background hell.jpg'
    }

    draw() {
        
        // Clear the canvas.
        const currentTransform = this.ctx.getTransform()
        this.ctx.setTransform(this.originalTransform)
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height)
        this.ctx.setTransform(currentTransform)

        // Shake view.
        this.doShakeScreen()

        // Draw background.
        this.ctx.drawImage(this.background, 0, 0, this.$canvas.width, this.$canvas.height)

        this.drawBalls()

        this.engine.paddle.draw(this.ctx)

        this.drawBricks()
        this.drawBrokenBricks()
    }


    drawBalls() {
        this.engine.balls.forEach(ball => {
            ball.draw(this.ctx)
        })
    }

    drawBricks() {
        this.engine.bricks.forEach(brick => {
            brick.draw(this.ctx)
        });
    }

    drawBrokenBricks() {
        this.engine.brokenBricks.forEach(brokenBrick => {
            brokenBrick.draw(this.ctx)
        });
    }

    /**
     * Shake the screen.
     */
    shakeScreen() {
        this.timeShake = this.engine.currentTime
    }

    /**
     * Update the screen shaking effect.
     */
    doShakeScreen() {
        const currentTime = this.engine.currentTime

        // Shake view for 300 ms.
        if (this.timeShake + 300 > currentTime) {
            this.ctx.translate(
                randomRange(-2, 2),
                randomRange(-2, 2)
            )
            this.ctx.rotate(randomRange(-0.01, 0.01))
        }
        // Don't do any shaking.
        else {
            this.ctx.setTransform(this.originalTransform)
        }
    }
}