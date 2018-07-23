
/** MVP: Two reel slot machine. Each reel has four faces. 
 * When player moves the stick down, the reels start spinning.
 * 
 * If both reels shot the same face, you get
 * that faceTypes credits.
 */



class SlotMachineController {
    constructor() {
        this.carousel = new Carousel()
        this.slotMachine = new SlotMachine(new FaceTypes())
        this.creditsElement = document.getElementById('credits')
        this.reelElements = [[
            document.getElementById('reel0-top'),
            document.getElementById('reel1-top'),
            document.getElementById('reel2-top')
        ], [
            document.getElementById('reel0'),
            document.getElementById('reel1'),
            document.getElementById('reel2')
        ],
        [
            document.getElementById('reel0-bottom'),
            document.getElementById('reel1-bottom'),
            document.getElementById('reel2-bottom')
        ]
        ]
        this.slotMachine.addEventListener('creditschanged', (credits) => {
            this.creditsElement.innerHTML = '' + credits
        })

        this.slotMachine.addEventListener('reelchanged', (reel) => {
            for (let i = 0; i < this.reelElements.length; i++) {
                this.reelElements[i][reel.position].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#${reel.getFace(i - 1).name}"></use></svg>`
            }
        })

        document.querySelector("input[value='Insert Coin'][type='button']").onclick = () => {
            this.slotMachine.coinInserted()
        }
        for (let reel of this.slotMachine.reels) {
            this.slotMachine.publish('reelchanged', reel)
        }
    }

    play() {
        this.addKeyPressEventListener()
        this.slotMachine.play()
    }

    addKeyPressEventListener() {
        window.addEventListener('keypress', (keyEvent) => {
            if (this.slotMachine.state !== 'playing') {
                return
            }
            if (keyEvent.key === 's' || keyEvent.key === 'S') {
                this.slotMachine.spin().then(this.slotMachine.recalculateCredits, (error) => console.log(error))
                return
            }
            if (keyEvent.key === 'c' || keyEvent.key === 'C') {
                this.slotMachine.coinInserted();
                return;
            }
            if (keyEvent.key === 'q' || keyEvent.key === 'Q') {
                this.quit()
            }
        })
    }

    quit() {
        this.slotMachine.quit()
    }
}

class SlotMachine {
    constructor(FACE_TYPES) {
        this.credits = 0
        this.reels = [
            new Reel(this, 0, FACE_TYPES.all),
            new Reel(this, 1, FACE_TYPES.all),
            new Reel(this, 2, FACE_TYPES.all)
        ]
        this.state = undefined
        this.eventListeners = {
            'nothing': []
        }
        this.recalculateCredits = this._recalculateCredits.bind(this)
        this.score = this._score.bind(this)
        this.twoCherries = this._twoCherries.bind(this)
        this.allReelsHaveSameFace = this._allReelsHaveSameFace.bind(this)
    }

    play() {
        this.state = 'playing';
        this.addCredits(20)
    }

    coinInserted() {
        this.addCredits(4)
    }

    addEventListener(name, listeningFunction) {
        if (!this.eventListeners[name]) {
            this.eventListeners[name] = []
        }
        this.eventListeners[name].push(listeningFunction)
    }

    publish(eventName, data) {
        if (!this.eventListeners) {
            return
        }
        for (let listener of this.eventListeners[eventName]) {
            if (typeof (listener) === typeof (function () { })) {
                listener(data)
            }
        }
    }

    addCredits(n) {
        this.credits += n
        this.publish('creditschanged', this.credits)
    }

    spin() {
        return new Promise((resolve, reject) => {
            if (this.credits > 0) {
                for (let reel of this.reels) {
                    reel.spin()
                }
                resolve()
            } else {
                reject('no more credits')
            }
        })
    }


    _recalculateCredits() {
        return new Promise((resolve) => {
            this.addCredits(-1)
            this.score()
        })
    }

    _score() {
        let result = 0;
        if (this.allReelsHaveSameFace()) {
            result = 2 * this.reels[2].getFace(1).value
        }
        if (this.twoCherries()) {
            this.result = 3
        }
        if (result !== 0) {
            this.addCredits(result)
        }
    }

    _allReelsHaveSameFace() {
        return
        this.reels[2].isSame(this.reels[0]) &&
            this.reels[1].isSame(this.reels[0])
    }

    _twoCherries() {
        if (this.reels[1].isSame(this.reels[0]) || this.reels[1].isSame(this.reels[2])) {
            return this.reels[1].getFace(1).isOneOf('cherry')
        }
    }

    quit() {
        this.state = 'quit'
    }
}

class Reel {
    constructor(slotMachine, position, faces) {
        this.slotMachine = slotMachine
        this.state = 'unlocked'
        this.id = 'reel' + position
        this.position = position
        this.faces = faces
        this.currentFaceIndex = this.faces.length
    }

    spin() {
        this.currentFaceIndex = (this.currentFaceIndex + Math.floor(Math.random() * this.faces.length)) % this.faces.length;
        this.slotMachine.publish('reelchanged', this)
    }

    getFace(n) {
        let i = (this.currentFaceIndex + n) % this.faces.length
        if (i < 0) {
            i = this.faces.length + i
        }
        return this.faces[i]
    }


    isSame(other) {
        return this.faces[this.currentFaceIndex] === other.faces[other.currentFaceIndex]
    }



}

class Face {
    constructor(name, value) {
        this.name = name
        this.value = value
    }

    isOneOf(other) {
        return this.name === other.name
    }
}

class FaceTypes {
    constructor() {
        this.cherry = new Face('cherry', 1)
        this.bar = new Face('bar', 2)
        this.plum = new Face('plum', 4)
        this.seven = new Face('seven', 7)
        this.watermelon = new Face('watermelon', 12)
        this.bell = new Face('bell', 18)
        this.all = [this.cherry, this.bar, this.plum, this.seven, this.watermelon, this.bell]
    }
}

window.onload = function () {
    new SlotMachineController().play()
}

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
