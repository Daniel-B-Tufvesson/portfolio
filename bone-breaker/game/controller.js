import { Engine, STATE_GAME_OVER, STATE_NEW_GAME, STATE_PAUSED, STATE_RUNNING } from "./engine.js"
import { DIRECTION_LEFT, DIRECTION_RIGHT} from "./game-objects/paddle.js"


/**
 * The controller for handling player input.
 */
export class Controller {

    debug = false

    /**
     * 
     * @param {HTMLCanvasElement} $canvas 
     * @param {Engine} engine 
     */
    constructor($canvas, engine) {
        this.engine = engine
        window.addEventListener('keydown', (event) => this.onKeyDown(event))
        window.addEventListener('keyup', (event) => this.onKeyUp(event))
    }

    onKeyDown(event) {
        if (this.debug) console.log('keydown: ', event.code)
        const gameState = this.engine.gameState
        
        event.preventDefault()

        // Handle space press to change game states.
        if (event.code === 'Space') {

            // Start game if new game.
            if (gameState === STATE_NEW_GAME) {
                this.engine.startGame()
            }

            // New game if game over.
            else if (gameState === STATE_GAME_OVER) {
                this.engine.newGame()
            }

        }

        // Handle paddle movement.
        if (gameState === STATE_NEW_GAME || gameState === STATE_RUNNING) {
            const paddle = this.engine.paddle

            // Move paddle left.
            if (event.code === 'ArrowLeft') {
                paddle.moveDirection = DIRECTION_LEFT
            }

            // Move paddle right.
            else if (event.code === 'ArrowRight') {
                paddle.moveDirection = DIRECTION_RIGHT
            }

            // Launch held ball. 
            if (event.code === 'Space' && paddle.holdingBall !== null) {
                paddle.launchBall()
            }
        }

        // Pause or resume game when escape is pressed.
        if (event.code === 'Escape') {

            // Pause game if running.
            if (gameState === STATE_RUNNING) {
                this.engine.pauseGame()
            }
            // Resume game if paused.
            else if (gameState === STATE_PAUSED) {
                this.engine.resumeGame()
            }
        }
    }

    onKeyUp(event) {
        if (this.debug) console.log('keyup: ', event.code)
        const gameState = this.engine.gameState

        // Handle paddle movement.
        if (gameState === STATE_NEW_GAME || gameState === STATE_RUNNING) {
            const paddle = this.engine.paddle

            // Stop moving paddle left.
            if (event.code === 'ArrowLeft' && paddle.moveDirection === DIRECTION_LEFT) {
                this.engine.paddle.moveDirection = 0
            }
            // Stop moving paddle right. 
            else if (event.code === 'ArrowRight' && paddle.moveDirection === DIRECTION_RIGHT) {
                this.engine.paddle.moveDirection = 0
            }
        }
    }
}