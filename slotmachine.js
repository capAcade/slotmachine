/** MVP: Two reel slot machine. Each reel has four faces. 
 * When player moves the stick down, the reels start spinning.
 * 
 * If both reels shot the same face, you get
 * that faceTypes credits.
 */


class SlotMachine {
    constructor(FACE_TYPES) {
        this.credits = 20
        this.reels = [
            new Reel(this, 0, FACE_TYPES.all), 
            new Reel(this, 1, FACE_TYPES.all),
            new Reel(this, 2, FACE_TYPES.all),
            new Reel(this, 3, FACE_TYPES.all)
        ]
        this.state = undefined
    }

    play() {
        this.refresh()
        window.addEventListener("keypress", (keyEvent) => {
            if (this.state !== 'playing') {
                return
            }
            if (keyEvent.key === ' ' || keyEvent.key === 'Space bar') {
                this.spin()
                return
            }
            if (keyEvent.key === 'q' || keyEvent.key === 'Q') {
                this.quit()
            }
        })
        this.state = 'playing';
    }

    spin() {
        for (let reel of this.reels) {
            reel.spin() 
        }
        this.credits--
        this.score()
        this.refresh()
        if (this.credits <= 0)  {
            this.quit()
        }
    }

    score() {
        if (this.allReelsHaveSameFace()) {
            this.credits += (6 * this.reels[3].getFace().value)
            return
        }
        if (this.threeConnectedReelsHaveSameFace()) {
            this.credits += (2 * this.reels[2].getFace().value)
            return
        }
        if (this.twoCherries()) {
            this.credits += 3
            return
        }
    }

    threeConnectedReelsHaveSameFace() {
        if (this.reels[1].isSame(this.reels[2])) {
            return this.reels[0].isSame(this.reels[1]) || this.reels[3].isSame(this.reels[1])
        }        
        return false
    }

    allReelsHaveSameFace()  {
        return
            this.reels[3].isSame(this.reels[0]) && 
            this.reels[2].isSame(this.reels[0]) && 
            this.reels[1].isSame(this.reels[0])          
    }

    twoCherries() {
        if (this.reels[1].isSame(this.reels[0]) || this.reels[1].isSame(this.reels[2])) {
            return this.reels[1].getFace().name === 'cherry'
        }
        if (this.reels[2].isSame(this.reels[3])) {
            return this.reels[2].getFace().name === 'cherry'
        }
    }

    refresh() {
        for (let reel of this.reels) {
            document.getElementById(reel.id).innerHTML = reel.getFace().name
        }
        document.getElementById('credits').innerHTML = this.credits; 
    }

    quit() {
        console.log('Insert coins')
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
    }

    getFace() {
        return this.faces[this.currentFaceIndex]
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
new SlotMachine(new FaceTypes()).play()
