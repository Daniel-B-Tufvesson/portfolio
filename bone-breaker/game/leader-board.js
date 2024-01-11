export class LeaderBoard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <div id="leader-board">
                <h1>LEADER BOARD</h1>
                <div id=player-list>
                    <template id="leader-board-player-template">
                        <div class="leader-board-player">
                            <p class="name"></p>
                            <p class="score"></p>
                        </div>
                    </template>
                </div>
            </div>
        `
    }
}

customElements.define('leader-board', LeaderBoard)