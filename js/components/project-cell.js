

const CLASS_INFO = 'project-cell-info'
const CLASS_IMAGE = 'project-cell-image'
const CLASS_HEADING = 'project-cell-heading'
const CLASS_TAGS = 'project-tags'
const CLASS_PROJECT_URL = 'project-url'

const HTML = `
    <a class=${CLASS_PROJECT_URL} href="index.html">
        <img class="${CLASS_IMAGE}"></img>
        <div class="${CLASS_INFO}">
            <h3 class="${CLASS_HEADING}"></h3>
        </div>
        <div class="${CLASS_TAGS}"></div>
    </a>
`

const ATTRIBUTE_IMAGE = 'image'
const ATTRIBUTE_HEADING = 'heading'
const ATTRIBUTE_TAGS = 'tags'
const ATTRIBUTE_URL = 'url';

export class ProjectCell extends HTMLElement {
    static observedAttributes = [ATTRIBUTE_IMAGE, ATTRIBUTE_HEADING, ATTRIBUTE_TAGS, ATTRIBUTE_URL];

    constructor() {
        super()

        // Retrieve the specified content.
        const content = Array.from(this.childNodes)

        this.innerHTML = HTML
        this.classList.add('project-cell')

        // Add content to component.
        const infoElement = this.querySelector('.' + CLASS_INFO)
        content.forEach(child => {infoElement.appendChild(child)})
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, newValue)
        switch(name) {
            case ATTRIBUTE_HEADING:
                this.querySelector('.' + CLASS_HEADING).textContent = newValue
                break

            case ATTRIBUTE_IMAGE:
                this.querySelector('.' + CLASS_IMAGE).src = newValue
                break


            case ATTRIBUTE_TAGS:
                this.setTags(newValue)
                break

            case ATTRIBUTE_URL:
                this.querySelector('.' + CLASS_PROJECT_URL).href = newValue
                break
        }
    }

    /**
     * Set the project tags.
     * @param {string} tags - a string of space separated tags. 
     */
    setTags(tags) {
        tags = tags.split(' ')
        const tagsContainer = this.querySelector('.' + CLASS_TAGS)
        tags.forEach(tag => {
            const tagElement = document.createElement('span')
            tagsContainer.append(tagElement)
            tagElement.classList.add('hashtag')
            tagElement.textContent = tag
        });
    }
}

customElements.define('project-cell', ProjectCell)