import { BallSpawnerBrick } from "./game-objects/ball-spawner-brick.js"
import { Ball } from "./game-objects/ball.js"
import { Brick } from "./game-objects/brick.js"
import { HealthBrick } from "./game-objects/health-brick.js"
import { Paddle } from "./game-objects/paddle.js"
import { Renderer } from "./renderer.js"


export const STATE_NEW_GAME = 0
export const STATE_RUNNING = 1
export const STATE_GAME_OVER = 2
export const STATE_PAUSED = 3
export const STATE_QUIT_GAME = 4
export const STATE_WIN_GAME = 5

const DEFAULT_HEALTH = 5

/**
 * The game engine is the top class for handling the logic and rendering of the game.
 */
export class Engine {

    isLoopRunning = false
    currentTime = null // The time in milliseconds when the game loop was last called.
    _gameState = STATE_NEW_GAME
    onGameStateChanged = null // Called whenever gameState is changed.
    _health = DEFAULT_HEALTH
    onHealthChanged = null // Called whenever health is changed.
    _score = 0
    onScoreChanged = null // Called whenever score is changed.

    bricks = []
    balls = []
    brokenBricks = []

    constructor($canvas) {
        this.$canvas = $canvas
        this.renderer = new Renderer(this, $canvas)

        this.paddle = new Paddle(this)

        this.newGame()
    }

    /**
     * Start the game loop.
     */
    startLoop() {
        this.isLoopRunning = true
        requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp))
    }


    /**
     * Stop the game loop.
     */
    stopLoop() {
        this.isLoopRunning = false
    }

    /**
     * Reset the current game and start a new game.
     */
    newGame() {
        console.log('new game!')
        this.gameState = STATE_NEW_GAME
        this.score = 0
        this.health = DEFAULT_HEALTH
        this.bricks = []
        this.balls = []
        this.brokenBricks = []
        this.spawnBricks()

        // Create ball.
        const ball = new Ball()
        ball.position.setXY(this.$canvas.width / 2, this.$canvas.height / 2)
        this.addBall(ball)

        // Place paddle at center.
        this.paddle.position.x = this.$canvas.width / 2 - this.paddle.size.x / 2
        this.paddle.position.y = this.$canvas.height - this.paddle.size.y - 10

        // Reset paddle movement.
        this.paddle.moveDirection = 0

        // Grab hold of ball.
        this.paddle.grabBall(ball)
    }


    get gameState() {
        return this._gameState
    }


    set gameState(newState) {
        this._gameState = newState
        if (this.onGameStateChanged !== null) {
            this.onGameStateChanged()
        }
    }

    /**
     * Start the game after a restart.
     */
    startGame() {
        console.log('start game!')
        this.gameState = STATE_RUNNING
    }


    /**
     * Terminates the current game.
     */
    gameOver() {
        console.log('game over!')
        this.gameState = STATE_GAME_OVER
    }


    /**
     * Win the game.
     */
    winGame() {
        console.log('win!')
        this.gameState = STATE_WIN_GAME
    }


    /**
     * Pause the game when running.
     */
    pauseGame() {
        console.log('pause game')
        this.gameState = STATE_PAUSED
    }


    /**
     * Resume the game from being paused. Causes the game to run again.
     */
    resumeGame() {
        console.log('resume game!')
        this.gameState = STATE_RUNNING
    }


    /**
     * Quit the game. Stops the game loop.
     */
    quitGame() {
        console.log('quit game!')
        this.gameState = STATE_QUIT_GAME
        this.isLoopRunning = false
    }


    /**
     * The game loop is responsible for continually updating and rendering the game.
     */
    gameLoop(timestamp) {

        // Initiate the current time if not already.
        if (this.currentTime === null) {
            this.currentTime = timestamp
        }

        // Calculate delta-time in seconds.
        const deltaTime = (timestamp - this.currentTime) / 1000.0
        this.currentTime = timestamp

        // Update the game.
        this.update(deltaTime)
        // Todo: use a deltaTime accumulator to make sure each time-step is equally large,
        // preventing, for example, moving objects from teleporting through walls when
        // computer lags.

        // Render the game.
        this.renderer.draw()

        // Continue running the game loop if not stopped.
        if (this.isLoopRunning) {
            requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp))
        }
    }


    /**
     * Update the logic of the game.
     */
    update(deltaTime) {

        if (this.gameState === STATE_NEW_GAME) {
            this.paddle.update(deltaTime)
        }
        else if (this.gameState === STATE_RUNNING) {
            // Update paddle.
            this.paddle.update(deltaTime)

            // Update balls.
            this.balls.forEach(ball => {
                ball.update(deltaTime)
            })

            // Update falling bricks.
            this.brokenBricks.forEach(brokenBrick => {
                brokenBrick.update(deltaTime)
            })

            // Check if won game. This happens when there are no more bricks.
            if (this.bricks.length === 0) {
                this.winGame()
            }

            // Check if balls have run out.
            if (this.balls.length === 0) {
                this.takeDamage()

                if (this.health > 0) {
                    // Spawn new ball on paddle.
                    const ball = new Ball()
                    this.addBall(ball)
                    this.paddle.grabBall(ball)
                }
            }
        }
    }

    /**
     * Inflict damage be decrementing the health by 1. The game is over if health reaches 0. 
     */
    takeDamage() {
        console.log('aj! take damage')
        this.health--
        this.renderer.shakeScreen()

        // Fire onHealthChanged callback.
        if (this.onHealthChanged !== null) {
            this.onHealthChanged()
        } 

        // Game over if health reaches zero.
        if (this.health <= 0) {
            this.gameOver()
        }
    }

    get health() {
        return this._health
    }


    set health(newHealth) {
        this._health = Math.max(newHealth, 0) // Health can't be below zero.
        if(this.onHealthChanged !== null) {
            this.onHealthChanged()
        }
    }


    get score() {
        return this._score
    }


    set score(newScore) {
        this._score = newScore
        if (this.onScoreChanged !== null) {
            this.onScoreChanged()
        }
    }


    addBall(ball) {
        console.log('add ball')
        this.balls.push(ball)
        ball.engine = this
    }


    removeBall(ball) {
        console.log('remove ball')
        const index = this.balls.indexOf(ball)
        this.balls.splice(index, 1)
        ball.engine = null
    }

    addBrick(brick) {
        console.log('add brick')
        this.bricks.push(brick)
        brick.engine = this
    }

    spawnBricks() {
        console.log('spawn bricks')

        const nCols = 10
        const brickWidth = this.$canvas.width / nCols
        for (let row = 0; row < 10; row++){
            for (let col = 0; col < nCols; col++) {
                const brick = this.generateBrickToSpawn()
                brick.size.x = brickWidth

                // Offset bricks on even rows.
                if (row % 2 === 0){
                    brick.position.setXY(col * brickWidth - brickWidth * 0.5, 30 + row * brick.size.y)
                }
                // Place normally on odd rows.
                else {
                    brick.position.setXY(col * brickWidth, 30 + row * brick.size.y)
                }

                this.addBrick(brick)
            }

            // Add brick at end of row on even rows.
            if (row % 2 === 0) {
                const brick = new Brick()
                brick.size.x = brickWidth
                brick.position.setXY(nCols * brickWidth - brickWidth * 0.5, 30 + row * brick.size.y)
                this.addBrick(brick)
            }
        }
    }


    generateBrickToSpawn() {
        const probability = Math.random()
        if (probability < 0.1) {
            return new HealthBrick()
        }
        else if (probability < 0.2) {
            return new BallSpawnerBrick()
        }
        else {
            return new Brick()
        }
    }

    removeBrick(brick) {
        console.log('remove brick')
        const index = this.bricks.indexOf(brick)
        this.bricks.splice(index, 1)
        brick.engine = null
    }

    addBrokenBrick(brick) {
        console.log('add broken brick')
        this.brokenBricks.push(brick)
        brick.engine = this
    }

    removeBrokenBrick(brick) {
        console.log('remove broken brick')
        this.brokenBricks.splice(this.brokenBricks.indexOf(brick), 1)
        brick.engine = null
    }
}