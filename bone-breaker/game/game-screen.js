import { Breakout } from "./breakout.js";
import { Controller } from "./controller.js"
import { Engine, STATE_GAME_OVER, STATE_NEW_GAME, STATE_PAUSED, STATE_QUIT_GAME, STATE_WIN_GAME } from "./engine.js"

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;

const GAME_OVER_OVERLAY_ID = 'game-over-overlay'
const NEW_GAME_OVERLAY_ID = 'new-game-overlay'
const PAUSE_OVERLAY_ID = 'pause-game-overlay'
const SCORE_DIGITS_CLASS = "score-digits"
const HEALTH_BAR_ID = 'health'
const RESUME_BUTTON_ID = 'resume-button'
const QUIT_BUTTON_CLASS = 'quit-button'
const NEW_GAME_BUTTON_CLASS = 'new-game-button'
const GAME_OVERLAY_CLASS = 'game-overlay'
const VICTORY_OVERLAY_ID = 'victory-overlay'

// Define the internal HTML structure of the GameScreen element.
const HTML = `
    <div id="sidebar">
        <h1>BONE<img src="./images/brick bone.png"></img>BREAKER <img src="./images/ball skull.png"></h1>
        <p id="score">SCORE: <span class="${SCORE_DIGITS_CLASS}">100</span></p>
        <div id="${HEALTH_BAR_ID}"></div>
    </div>

    <div id="canvas-container">
        <canvas id="game-canvas"></canvas>

        <div class="${GAME_OVERLAY_CLASS}" id="${GAME_OVER_OVERLAY_ID}">
            <h1>YOU DIED</h1>
            <p>SCORE: <span class="${SCORE_DIGITS_CLASS}">888</span></p>
            <p>Press SPACE to restart</p>
        </div>

        <div class="${GAME_OVERLAY_CLASS}" id="${NEW_GAME_OVERLAY_ID}">
            <p>Press space to start!</p>
            <p>Arrow keys to move left or right</p>
            <p>SPACE to launch ball</p>
        </div>

        <div class="${GAME_OVERLAY_CLASS}" id="${PAUSE_OVERLAY_ID}">
            <h1>GAME PAUSED!</h1>
            <!-- <button class="${QUIT_BUTTON_CLASS}">Quit to menu</button> -->
            <button class="${NEW_GAME_BUTTON_CLASS}">Restart game</button>
            <button id="${RESUME_BUTTON_ID}">Resume game (ESC)</button>
        </div>

        <div class="${GAME_OVERLAY_CLASS}" id="${VICTORY_OVERLAY_ID}">
            <h1>VICTORY!</h1>
            <p>Congratulations! You broke every bone! What a grand achievement!</p>
            <p>FINAL SCORE: <span class="${SCORE_DIGITS_CLASS}">888</span></p>

            <div>
                <button class="${NEW_GAME_BUTTON_CLASS}">Play again</button>
                <button class="${QUIT_BUTTON_CLASS}">Quit to menu</button>
            </div>
        </div>
    </div>
`

// Define the style of the GameScreen element.
const STYLE = `
    <style>
        :host {
            /*min-height: 100vh;*/
            display: flex;
            gap: 50px;

            background-color: gray;
            color: white;
            text-shadow: black 3px 3px 5px;
            font-family: 'Times New Roman', Times, serif;
        }

        #sidebar {
            padding-left: 20px;
            width: 350px;
        }

        #sidebar > h1 {
            font-size: 26pt;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
        }

        #canvas-container {
            position: relative;
            width: ${CANVAS_WIDTH}px;
            height: ${CANVAS_HEIGHT}px;
            border: solid 2px black;
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        #game-canvas {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .game-overlay {
            position: absolute;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding-bottom: 20px;

            font-family: 'Times New Roman', Times, serif;
            color: white;
            background-color: rgb(0, 0, 0, 0.7);
        }

        #${GAME_OVER_OVERLAY_ID} {
            opacity: 1;
        }

        #${GAME_OVER_OVERLAY_ID} > h1 {
            color: red;
            font-size: 50pt;
        }

        button {
            font-size: 15pt;
            padding: 10px;
            font-family: 'Times New Roman', Times, serif;
        }

        .hidden {
            display: none;
        }

        #${HEALTH_BAR_ID} {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }

        #${HEALTH_BAR_ID} > img {
            widht: 26px;
            height: 24px;
            image-rendering: pixelated;
            padding: 2px;
        }

        #score {
            font-size: 17pt;   
        }
    </style>
`

// Create a template for the heart icons in the health bar.
const HEART_ICON_TEMPLATE = document.createElement('img')
HEART_ICON_TEMPLATE.src = './images/heart.png'

/**
 * The game screen is the main class which puts all the active gameplay elements together. 
 */
export class GameScreen extends HTMLElement {

    /**
     * 
     * @param {Breakout} breakoutGame 
     */
    constructor(breakoutGame) {
        super()
        this.breakoutGame = breakoutGame
        this.attachShadow({mode:'open'})

        this.shadowRoot.innerHTML = HTML + STYLE
        
        // Configure the canvas.
        this.$canvas = this.shadowRoot.querySelector('#game-canvas')
        this.$canvas.width = CANVAS_WIDTH
        this.$canvas.height = CANVAS_HEIGHT

        

        // Create the engine.
        this.engine = new Engine(this.$canvas)
        this.engine.onGameStateChanged = () => this.handleGameStateChange()
        this.engine.onScoreChanged = () => this.updateScoreUI()
        this.engine.onHealthChanged = () => this.updateHealthUI()

        // Create the controller.
        const controller = new Controller(this.$canvas, this.engine)

        // Quit game when quit-button is pressed.
        this.shadowRoot.querySelectorAll('.' + QUIT_BUTTON_CLASS).forEach(button => {
            button.addEventListener('click', () => this.engine.quitGame())
        })

        // New game when new-game button is pressed.
        this.shadowRoot.querySelectorAll('.' + NEW_GAME_BUTTON_CLASS).forEach(button => {
            button.addEventListener('click', () => this.engine.newGame())
        })

        // Resume game when resume-button is pressed.
        this.shadowRoot.querySelector('#' + RESUME_BUTTON_ID).addEventListener('click', () => this.engine.resumeGame())

        this.engine.newGame()

        this.updateHealthUI()
        this.updateScoreUI()
    }

    connectedCallback() {
        console.log('connected callback')
        this.engine.startLoop()

        //const canvasStyle = getComputedStyle(this.$canvas)
        //this.$canvas.width = parseInt(canvasStyle.width)
        //this.$canvas.height = parseInt(canvasStyle.height)
    }

    disconnectedCallback() {
        this.engine.stopLoop()
    }

    setOverlay(overlayID) {

        // Show the correct overlay, and hide the others.
        const overlays = this.shadowRoot.querySelectorAll('.' + GAME_OVERLAY_CLASS)
        overlays.forEach(overlay => {
            if(overlay.id === overlayID) {
                overlay.classList.remove('hidden')
            }
            else {
                overlay.classList.add('hidden')
            }

        })
    }


    handleGameStateChange() {
        const newState = this.engine.gameState
        switch (newState) {

            case STATE_GAME_OVER:
                this.setOverlay(GAME_OVER_OVERLAY_ID)
                break

            case STATE_NEW_GAME:
                this.setOverlay(NEW_GAME_OVERLAY_ID)
                break

            case STATE_PAUSED:
                this.setOverlay(PAUSE_OVERLAY_ID)
                break
            
            case STATE_WIN_GAME:
                this.setOverlay(VICTORY_OVERLAY_ID)
                break

            case STATE_QUIT_GAME:
                this.breakoutGame.toMainMenu()

            default:
                this.setOverlay(null)
                break
        }
    }

    updateScoreUI() {
        const score = this.engine.score
        const $scoreElements = this.shadowRoot.querySelectorAll('.' + SCORE_DIGITS_CLASS)
        $scoreElements.forEach(element => {
            element.textContent = score
        })
    }

    updateHealthUI() {
        const health = this.engine.health
        const healthBar = this.shadowRoot.querySelector('#' + HEALTH_BAR_ID)
        
        // Remove hearts until matching health.
        while (healthBar.childElementCount > health) {
            healthBar.firstChild.remove()
        }

        // Or add hearts until matching health.
        while (healthBar.childElementCount < health) {
            healthBar.appendChild(HEART_ICON_TEMPLATE.cloneNode(true))
        }
    }

}

customElements.define('game-screen', GameScreen)