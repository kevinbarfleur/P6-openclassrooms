import { getRandomInt } from './utils/utils'

export default class Weapon {
    constructor(posX, posY, weapon, global) {
        this.pos = { x: posX, y: posY }
        this.global = global
        this.weapon = weapon
    }

    draw(context, sprites) {
        sprites.draw(
            this.weapon,
            context,
            this.pos.x * this.global.unit,
            this.pos.y * this.global.unit
        )
    }

    isPlayerHere(x, y) {
        if (this.global.playersInstances) {
            for (let player of this.global.playersInstances) {
                if (
                    player.pos.x === x * this.global.unit &&
                    player.pos.y === y * this.global.unit
                ) {
                    return true
                }
            }
            return false
        }
    }

    getClicked(x, y) {
        if (this.player === this.global.currentPlayer) {
            if (!this.isHover(x, y)) return false
            else {
                return {
                    x,
                    y
                }
            }
        }
    }

    isHover(x, y) {
        return (
            this.global.mousePos.x / this.global.unit >= x &&
            this.global.mousePos.x / this.global.unit <= x + 1 &&
            this.global.mousePos.y / this.global.unit >= y &&
            this.global.mousePos.y / this.global.unit <= y + 1
        )
    }

    setPos(newPos) {
        this.pos = newPos
    }
    getPos() {
        return this.pos
    }
    setMousePos(newMousePos) {
        this.global.mousePos = newMousePos
    }
    getMousePos() {
        return this.global.mousePos
    }
    setFrameIndex(newFrameIndex) {
        this.frameIndex = newFrameIndex
    }
    setFrames(newFrames) {
        this.frames = newFrames
    }
    setCurrentPlayer(newPlayer) {
        this.global.currentPlayer = newPlayer
    }
    getGlobal() {
        return this.global
    }
    setGlobal(newGlobal) {
        this.global = newGlobal
    }
}
