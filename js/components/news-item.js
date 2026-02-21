


const HTML = `
    <div class="news-item-header">
        <h5 id="heading"></h5>
        <span id="date" class="news-item-date"></span>
    </div>
    <p id="user-content"></p>
    
`

export class NewsItem extends HTMLElement {
    static observedAttributes = ['date', 'heading']

    constructor() {
        super()
        const content = Array.from(this.childNodes) // Retrieve the specified content.
        this.innerHTML = HTML
        this.classList.add("news-item")

        // Add content to component.
        const userContentContainer = this.querySelector('#user-content')
        content.forEach(child => {userContentContainer.appendChild(child)})
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'date':
                this.querySelector('#date').textContent = newValue
                break

            case 'heading':
                this.querySelector('#heading').textContent = newValue
                break
        }
    }
}

customElements.define('news-item', NewsItem)