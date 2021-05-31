import { getRandomInt } from './utils/utils'

export default class Character {
    constructor(player, classe, hp, inventory, posX, posY, frames, global) {
        this.player = player
        this.classe = classe
        this.hp = hp
        this.inventory = inventory
        this.pos = { x: posX, y: posY }
        this.frames = frames
        this.frameIndex = 1
        this.moves = {}
        this.global = global

        this.formatFrames()
    }

    draw(context, sprites) {
        sprites.draw(
            this.frames[this.frameIndex],
            context,
            this.pos.x,
            this.pos.y
        )
        if (this.player === this.global.currentPlayer)
            this.drawMoveOptions(context, sprites)

        this.setFrameIndex(this.frameIndex + 1)
        if (this.frameIndex === this.frames.length - 1) {
            this.setFrameIndex(1)
        }
    }

    drawMoveOptions(context, sprites) {
        for (let moveTile in this.getMoveOptions()) {
            const tile = this.getMoveOptions()[moveTile]

            if (tile) {
                if (this.isHover(tile.x, tile.y, this.global.mousePos)) {
                    sprites.drawTile(
                        this.global.currentPlayer === 2
                            ? 'playerOneHover'
                            : 'playerTwoHover',
                        context,
                        tile.x * 2,
                        tile.y * 2
                    )
                } else {
                    sprites.drawTile(
                        this.global.currentPlayer === 2
                            ? 'playerOneInitial'
                            : 'playerTwoInitial',
                        context,
                        tile.x * 2,
                        tile.y * 2
                    )
                }
            }
        }
    }

    placeCharacter() {
        let level = this.global.board.currentLevel
        let dimensions = this.global.boardDimensions
        let placed = false

        let count = 0

        while (placed === false) {
            count += 1

            let x, y

            if (this.player === 1) {
                x = getRandomInt(dimensions.x - 2, dimensions.x)
                y = getRandomInt(1, dimensions.y)
            } else {
                x = getRandomInt(1, 3)
                y = getRandomInt(1, dimensions.y)
            }

            if (level[y][y].includes('ground') && !this.isPlayerHere(x, y)) {
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

    formatFrames() {
        const frames = []
        const repeat = Math.round(this.global.fps / this.frames.length) / 9

        for (let i = 0; i < this.frames.length; i++) {
            for (let j = 0; j < repeat; j++) {
                frames.push(this.frames[i])
            }
        }

        this.setFrames(frames)
    }

    getMoveOptions() {
        const playerX = this.pos.x / this.global.unit
        const playerY = this.pos.y / this.global.unit
        const currentLevel = this.global.currentLevel
        const boardDimensions = this.global.boardDimensions

        const top1 =
            playerY > 1 &&
            currentLevel[playerX][playerY - 1].includes('ground') &&
            !this.isPlayerHere(playerX, playerY - 1)
                ? {
                      x: playerX,
                      y: playerY - 1
                  }
                : false
        const top2 =
            playerY > 2 &&
            currentLevel[playerX][playerY - 2].includes('ground') &&
            top1 &&
            !this.isPlayerHere(playerX, playerY - 2)
                ? {
                      x: playerX,
                      y: playerY - 2
                  }
                : false
        const top3 =
            playerY > 3 &&
            currentLevel[playerX][playerY - 3].includes('ground') &&
            top1 &&
            top2 &&
            !this.isPlayerHere(playerX, playerY - 3)
                ? {
                      x: playerX,
                      y: playerY - 3
                  }
                : false
        const bottom1 =
            playerY < boardDimensions.y &&
            currentLevel[playerX][playerY + 1].includes('ground') &&
            !this.isPlayerHere(playerX, playerY + 1)
                ? {
                      x: playerX,
                      y: playerY + 1
                  }
                : false
        const bottom2 =
            playerY < boardDimensions.y - 1 &&
            currentLevel[playerX][playerY + 2].includes('ground') &&
            bottom1 &&
            !this.isPlayerHere(playerX, playerY + 2)
                ? {
                      x: playerX,
                      y: playerY + 2
                  }
                : false
        const bottom3 =
            playerY < boardDimensions.y - 2 &&
            currentLevel[playerX][playerY + 3].includes('ground') &&
            bottom1 &&
            bottom2 &&
            !this.isPlayerHere(playerX, playerY + 3)
                ? {
                      x: playerX,
                      y: playerY + 3
                  }
                : false
        const left1 =
            playerX > 1 &&
            currentLevel[playerX - 1][playerY].includes('ground') &&
            !this.isPlayerHere(playerX - 1, playerY)
                ? {
                      x: playerX - 1,
                      y: playerY
                  }
                : false
        const left2 =
            playerX > 2 &&
            currentLevel[playerX - 2][playerY].includes('ground') &&
            left1 &&
            !this.isPlayerHere(playerX - 2, playerY)
                ? {
                      x: playerX - 2,
                      y: playerY
                  }
                : false
        const left3 =
            playerX > 3 &&
            currentLevel[playerX - 3][playerY].includes('ground') &&
            left1 &&
            left2 &&
            !this.isPlayerHere(playerX - 3, playerY)
                ? {
                      x: playerX - 3,
                      y: playerY
                  }
                : false
        const right1 =
            playerX < boardDimensions.x &&
            currentLevel[playerX + 1][playerY].includes('ground') &&
            !this.isPlayerHere(playerX + 1, playerY)
                ? {
                      x: playerX + 1,
                      y: playerY
                  }
                : false
        const right2 =
            playerX < boardDimensions.x - 1 &&
            currentLevel[playerX + 2][playerY].includes('ground') &&
            right1 &&
            !this.isPlayerHere(playerX + 2, playerY)
                ? {
                      x: playerX + 2,
                      y: playerY
                  }
                : false
        const right3 =
            playerX < boardDimensions.x - 2 &&
            currentLevel[playerX + 3][playerY].includes('ground') &&
            right1 &&
            right2 &&
            !this.isPlayerHere(playerX + 3, playerY)
                ? {
                      x: playerX + 3,
                      y: playerY
                  }
                : false

        return {
            top1,
            top2,
            top3,
            bottom1,
            bottom2,
            bottom3,
            left1,
            left2,
            left3,
            right1,
            right2,
            right3
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

    setHp(newHp) {
        this.hp = newHp
    }
    getHp() {
        return this.hp
    }
    setInventory(newInventory) {
        this.inventory = newInventory
    }
    getInventory() {
        return this.inventory
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
