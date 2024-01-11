import { MainMenu } from "./main-menu.js"
import { GameScreen } from "./game-screen.js"
import { LeaderBoard } from "./leader-board.js"


// "You can't make an omelet without breaking a few bones."

/**
 * The main class of the Breakout game. This manages the navigation between different elements external
 * to the actual gameplay (such as leader boards and choosing player name). 
 */
export class Breakout extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:'open'})
        //this.toMainMenu()
        this.startGame()
    }

    clearChildren() {
        while (this.shadowRoot.childElementCount > 0) {
            this.shadowRoot.lastChild.remove()
        }
    }

    toMainMenu() {
        this.clearChildren()
        this.shadowRoot.appendChild(new MainMenu(this))
    }

    startGame() {
        this.clearChildren()
        this.shadowRoot.appendChild(new GameScreen(this))
    }

    toLeaderBoard() {
        this.clearChildren()
        this.shadowRoot.appendChild(new LeaderBoard())
    }
}

customElements.define('breakout-game', Breakout)


