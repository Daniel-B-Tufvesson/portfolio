
const HTML_TAG = 'project-tag'

export class Tag extends HTMLElement {

    constructor() {
        super()
        this.classList.add('hashtag')
    }
}

customElements.define(HTML_TAG, Tag)