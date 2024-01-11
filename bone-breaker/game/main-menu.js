
const HIDDEN_CLASS = 'hidden'

// Define the internal HTML structure of the MainMenu element.
const HTML = `
    <div class="main-menu">
        <h1>BONE<img src="./images/brick bone.png"></img>BREAKER <img src="./images/ball skull.png"></h1>

        <div class="main-menu-list">
            <button id="new-game-button">NEW GAME</button>
            <!-- <button id="leader-board-button">LEADER BOARD</button> -->
        </div>

    </div>
`

// Define the style of the MainMenu element.
const STYLE = `
    <style>
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            background: url("./images/background hell.jpg") no-repeat center center fixed;
            background-size: cover;
            height: 100vh;
        }

        h1 {
            font-family: 'Times New Roman', Times, serif;
            font-size: 50pt;
            color: white;
            text-shadow: black 3px 3px 5px;

            display: flex;
            flex-direction: row;
            jusitfy-content: center;
            align-items: center;
        }

        h1 > img {
            scale: 2;
            image-rendering: pixelated;
            padding-left: 25px;
            padding-right: 25px;
        }

        .main-menu-list {
            padding-top: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        button {
            width: 80%;
            font-size: 20pt;
            padding: 10px;
        }

        p {
            font-family: 'Times New Roman', Times, serif;
            font-size: 20pt;
        }

        input[type=text] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            box-sizing: border-box;
            font-size: 20pt;
        }

        .hidden {
            display: none;
        }
    </style>
`

export class MainMenu extends HTMLElement {
    constructor($breakout) {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = HTML + STYLE

        const $mainMenuList = this.shadowRoot.querySelector('.main-menu-list')

        // Start new game if new game button is pressed.
        this.shadowRoot.querySelector('#new-game-button').addEventListener('click', () => {
            $mainMenuList.classList.add(HIDDEN_CLASS)
            $breakout.startGame()
        })

        // Go to leader board if clicking leader board button.
        /*
        this.shadowRoot.querySelector('#leader-board-button').addEventListener('click', () => {
            $breakout.toLeaderBoard()
        })*/

    }

}

customElements.define('main-menu', MainMenu)
