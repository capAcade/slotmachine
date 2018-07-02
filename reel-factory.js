class ReelFactory {
    constructor() {
        this.reelSymbols = new Array[4]
        this.reelSymbols[0]=['cherry', 'plum', 'bell', 'bar', 'seven', 'cherry', 'watermelon', 'plum', 'bar', 'cherry','seven'] 
        this.reelSymbols[1]=['watermelon', 'cherry', 'bar','plum', 'bell', 'seven', 'cherry', 'watermelon', 'plum', 'bar', 'cherry']
        this.reelSymbols[2]=['cherry', 'plum', 'bell', 'bar', 'seven', 'cherry', 'watermelon', 'plum', 'bar', 'cherry','seven']
        this.reelSymbols[3]=['watermelon','cherry', 'bar', 'plum', 'bell', 'cherry', 'seven', 'watermelon', 'cherry', 'plum', 'bar']
    }
    
    create(n) {
        if (n && n>=0 && n<this.reelSymbols.length) {
            result = new Reel(this.reelSymbols[n])
        } else {
            reel = new Reel()
        }
        return result
    }
}

class Reel {
    constructor(symbols) {
        this.symbols = symbols 
        this.selectedIndex = 0
    }
}


class ReelController {
    constructor(n, reelElement) {
        window.reelFactory = window.reelFactory || new ReelFactory()
        if (isNaN(n) || n<0) {
            throw `illegal argument n=${n}`
        }
        if (!reelElement) {
            throw 'illegal argument'
        }
        element = reelElement || document.querySelector(`reel_${n}`)
        if (!reelElement.id) {
            reelElement.id = this.id
        }
        if (!reelElement.id) {
            this.id = `reel_${n}`
        }
        if (!reelElement.classList.contains('reel')) {
            ree
        }
        this.reel = window.reelFactory.create(n)
        this.reelElement = reelElement
    }

    initCells() {
        this.cells = this.querySelectorAll('.reel')
        for (let i=0; i<this.cells.length; i++) {
            let symbol = this.symbols[i % this.symbols.length]
            this.cells[i].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#${symbol}"></use></svg>`
        }
        this.selectedIndex = 0
        this.cellWidth = this.carousel.offsetWidth
        this.cellHeight = this.carousel.offsetHeight
    }



    next() {
        this.reel.next()
        this.animate()
    }

    animate() {

    }

}