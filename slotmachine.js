/** MVP: Two reel slot machine. Each reel has four faces. 
 * When player moves the stick down, the reels start spinning.
 * 
 * If both reels shot the same face, you get
 * that faceTypes credits.
 */

class SlotMachineController {
    constructor() {
        this.slotMachine = new SlotMachine(new FaceTypes())
        this.creditsElement = document.getElementById('credits')
        this.reelElements = [[
                document.getElementById('reel0-top'),
                document.getElementById('reel1-top'),
                document.getElementById('reel2-top'),
                document.getElementById('reel3-top')
            ],[
                document.getElementById('reel0'),
                document.getElementById('reel1'),
                document.getElementById('reel2'),
                document.getElementById('reel3')
            ],
            [
                document.getElementById('reel0-bottom'),
                document.getElementById('reel1-bottom'),
                document.getElementById('reel2-bottom'),
                document.getElementById('reel3-bottom')
            ]
        ]
        this.slotMachine.addEventListener('creditschanged', (credits) => {
            this.creditsElement.innerHTML = '' + credits
        })

        this.slotMachine.addEventListener('reelchanged', (reel) => {
            for(let i=0; i<this.reelElements.length;i++) {
                this.reelElements[i][reel.position].innerHTML = reel.getFace(i-1).name
            }
        })

        document.querySelector("input[value='Insert Coin'][type='button']").onclick = () => {this.slotMachine.addCredits(4)}
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
            if (keyEvent.key === ' ' || keyEvent.key === 'Space bar') {
                this.slotMachine.spin().then(this.slotMachine.recalculateCredits, (error) => console.log(error))
                return
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
            new Reel(this, 2, FACE_TYPES.all),
            new Reel(this, 3, FACE_TYPES.all)
        ]
        this.state = undefined
        this.eventListeners = {
            'nothing': []
        }
        this.recalculateCredits = this._recalculateCredits.bind(this)
        this.score = this._score.bind(this)
        this.twoCherries = this._twoCherries.bind(this)
        this.allReelsHaveSameFace = this._allReelsHaveSameFace.bind(this)
        this.threeConnectedReelsHaveSameFace = this._threeConnectedReelsHaveSameFace.bind(this)
    }

    play() {
        this.state = 'playing';
        this.addCredits(20)
    }

    addEventListener(name, listeningFunction) {
        if (!this.eventListeners[name])  {
            this.eventListeners[name] = []
        }
        this.eventListeners[name].push(listeningFunction)
    }

    publish(eventName, data) {
        if (!this.eventListeners) {
            return
        }
        for (let listener of this.eventListeners[eventName]) {
            if (typeof(listener) === typeof(function(){})) {
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
        if (this.allReelsHaveSameFace()) {
            this.addCredits(6 * this.reels[3].getFace(0).value)
            return
        }
        if (this.threeConnectedReelsHaveSameFace()) {
            this.addCredits(2 * this.reels[2].getFace(0).value)
            return
        }
        if (this.twoCherries()) {
            this.addCredits(3)
            return
        }
    }

    _threeConnectedReelsHaveSameFace() {
        if (this.reels[1].isSame(this.reels[2])) {
            return this.reels[0].isSame(this.reels[1]) || this.reels[3].isSame(this.reels[1])
        }        
        return false
    }

    _allReelsHaveSameFace()  {
        return
            this.reels[3].isSame(this.reels[0]) && 
            this.reels[2].isSame(this.reels[0]) && 
            this.reels[1].isSame(this.reels[0])          
    }

    _twoCherries() {
        if (this.reels[1].isSame(this.reels[0]) || this.reels[1].isSame(this.reels[2]) ) {
            return this.reels[1].getFace(0).name === 'cherry'
        }
        if (this.reels[2].isSame(this.reels[3])) {
            return this.reels[2].getFace(0).name === 'cherry'
        }
    }

    quit() {
        this.state = 'quit'
    }
}

class Reel {
    constructor(slotMachine, position, faces) {
        this.slotMachine = slotMachine
        this.state =  'unlocked'
        this.id = 'reel' + position
        this.position = position
        this.faces = faces
        this.currentFaceIndex = 0 
    }

    spin() {
        this.currentFaceIndex = (this.currentFaceIndex + Math.floor(Math.random() * this.faces.length)) % this.faces.length;
        this.slotMachine.publish('reelchanged', this)
    }

    getFace(n) {
        let i = (this.currentFaceIndex + n) % this.faces.length
        if (i<0) {
            i = this.faces.length + i
        }
        return this.faces[i]
    }


    isSame(other) {
        return this.faces[this.currentFaceIndex] === other.faces[other.currentFaceIndex] 
    }


 
}

class FaceTypes {
    constructor() {
        this.cherry = { name: 'cherry', value: 1}
        this.bar = {name: 'bar', value: 2}
        this.plum = {name: 'plum', value: 4}
        this.seven = {name: 'seven', value: 7}
        this.watermelon = {name: 'watermelon', value: 11}
        this.bell = {name: 'bell', value: 16}
        this.all = [this.cherry, this.bar, this.plum, this.seven, this.watermelon, this.bell]
    }
}

window.onload = function() {
    new SlotMachineController().play()
}