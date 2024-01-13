
const HTML = `
<div class="media-container">
    <div class="media-slot"></div>
    <div class="media-overlay">
        <div class="media-overlay-content"></div>
    </div>
</div>
`


class MediaWithOverlay extends HTMLElement {
    constructor() {
        super()

        // Get media and content.
        const $media = this.querySelector('.mo-media')
        const $content = this.querySelector('.mo-content')

        // Set new html.
        this.innerHTML = HTML

        // Add stuff to new html.
        this.querySelector('.media-slot').appendChild($media)
        this.querySelector('.media-overlay-content').appendChild($content)
    }
}

customElements.define('media-with-overlay', MediaWithOverlay)