
const HTML = `
    <p><a href="https://www.linkedin.com/in/daniel-tufvesson-a4541929a/">LinkedIn</a></p>
    <p>daniel.tufvesson@outlook.com</p>
    <p><a href="https://github.com/Daniel-B-Tufvesson">GitHub</a></p>

    <p class="copyright">© <span class="curr-year">2024</span> by Daniel Tufvesson</p>
`

class PortfolioFooter extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = HTML

        // Set current year.
        const yearSpan = this.querySelector('.curr-year')
        const currentYear = new Date().getFullYear()
        yearSpan.textContent = currentYear
    }
}

customElements.define('portfolio-footer', PortfolioFooter)