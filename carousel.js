class Carousel {

    constructor(elementId, symbols) {
        this.elementId = elementId
        console.log(`#${elementId}`)
        this.carousel = document.querySelector(`#${elementId}`)
        this.symbols = symbols || ['watermelon', 'cherry', 'plum', 'seven', 'bar']
        this.initCells()
        this.theta = 360 / this.cells.length
        this.rotator = false
        this.changeCarousel()
    }

    rotateCarousel() {
        let steps = 3 * this.cells.length + this.selectedIndex
        for (let step=0; step<steps; step++) {
            this.carousel.style.transform = `translateZ(-${this.radius}px) rotateX(${this.theta * steps}deg)`
        }
    }

    initCells() {
        this.cells = this.carousel.querySelectorAll('.carousel__cell')
        for (let i=0; i<this.cells.length; i++) {
            let symbol = this.symbols[i % this.symbols.length]
            this.cells[i].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#${symbol}"></use></svg>`
        }
        this.selectedIndex = 0
        this.cellWidth = this.carousel.offsetWidth
        this.cellHeight = this.carousel.offsetHeight
    }

    changeCarousel() {
        this.theta = 360 / this.cells.length
        this.radius = Math.round( ( this.cellHeight / 2) / Math.tan( Math.PI / this.cells.length) )
        let i = 0
        this.cells.forEach(cell => {
            this.showCell(cell, i++)
        })
    }

    showCell(cell, i) {
        cell.style.opacity = 1
        cell.style.transform = `rotateX(${this.theta * i}deg) translateZ(${this.radius}px)`
    }
    
    next() {
            this.selectedIndex = (Math.floor(this.cells.length * Math.random())) + this.selectedIndex + 400
    }

    rotate() {
        this.next()
        this.rotateCarousel()
    }

    stop() {
        if (this.rotator) {
            window.clearInterval(this.rotator)
        }
        this.rotator = false
    }
}

class Carousels {
    constructor() {
        this.items = [new Carousel('carousel0'), new Carousel('carousel1'), new Carousel('carousel2')]
    }        

    rotate() {
        for (let item of this.items) {
            item.rotate()
        }
    }

    stop() {
        for (let item of this.items) {
            item.stop()
        }
    }
}

window.carousels = new Carousels();


