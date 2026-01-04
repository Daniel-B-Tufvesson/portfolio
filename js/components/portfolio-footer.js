
const HTML = `
    <p><a href="https://www.linkedin.com/in/daniel-tufvesson-a4541929a/">LinkedIn</a></p>
    <p>daniel.tufvesson@outlook.com</p>
    <p><a href="https://github.com/Daniel-B-Tufvesson">GitHub</a></p>

    <p class="copyright">© 2024 by Daniel Tufvesson</p>
`

class PortfolioFooter extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = HTML
    }
}

customElements.define('portfolio-footer', PortfolioFooter)