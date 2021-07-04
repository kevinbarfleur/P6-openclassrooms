import { getRandomInt } from './utils/utils'

export default class Weapon {
    constructor(weapon, global) {
        this.pos = { x: null, y: null }
        this.global = global
        this.weapon = weapon
        this.isHeld = false
    }

    draw(context, sprites) {
        if (!this.isHeld)
            sprites.draw(this.weapon, context, this.pos.x, this.pos.y)
    }

    placeWeapon() {
        let level = this.global.currentLevel
        let dimensions = this.global.boardDimensions
        let placed = false

        let count = 0

        while (placed === false) {
            count += 1

            let x, y

            x = getRandomInt(2, dimensions.x - 2)
            y = getRandomInt(2, dimensions.y - 2)

            // const exceptions = []
            for (let players of this.global.playersInstances) {
                const options = players.getMoveOptions()

                for (let option in options) {
                    if (options[option].x === x && options[option].y === y) {
                        continue
                    }
                }
            }

            if (
                level[x][y].includes('ground') &&
                !this.isPlayerHere(x, y) &&
                !this.isWeaponHere(x, y)
            ) {
                this.setPos({
                    x: x * this.global.unit,
                    y: y * this.global.unit
                })

                placed = true
            }

            if (count >= 500) {
                placed = false
                window.location.reload()
            }
        }
    }

    isWeaponHere(x, y) {
        if (this.global.weaponsInstances) {
            for (let weapon of this.global.weaponsInstances) {
                if (
                    weapon.pos.x === x * this.global.unit &&
                    weapon.pos.y === y * this.global.unit
                ) {
                    return true
                }
            }
            return false
        }
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
