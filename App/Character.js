let count = 0

export default class Character {
    constructor(classe, hp, inventory, posX, posY, frames, global) {
        this.classe = classe
        this.hp = hp
        this.inventory = inventory
        this.pos = { x: posX, y: posY }
        this.frames = frames
        this.moves = {}
        this.global = global
    }

    draw(context, sprites) {
        for (let i = 0; i < this.frames.length; i++) {
            setTimeout(() => {
                this.global.drawBoard(
                    this.global.currentLevel,
                    sprites,
                    context
                )
                sprites.draw(
                    `${this.classe + (i + 1)}`,
                    context,
                    this.pos.x,
                    this.pos.y
                )
                console.log(count)
                count += 1
                this.drawMoveOptions(context)
                if (i === this.frames.length - 1) {
                    i = 0
                    this.draw(context, sprites)
                }
            }, this.global.fps * i)
        }
    }

    drawMoveOptions(context) {
        for (let moveTile in this.getMoveOptions()) {
            const tile = this.getMoveOptions()[moveTile]

            if (tile) {
                context.beginPath()
                context.fillStyle = this.isHover(
                    tile.x,
                    tile.y,
                    this.global.mousePos
                )
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(255, 255, 255, 0.2)'
                context.fillRect(
                    tile.x * this.global.unit,
                    tile.y * this.global.unit,
                    this.global.unit,
                    this.global.unit
                )
                context.stroke()
            }
        }
    }

    getMoveOptions() {
        const playerX = this.pos.x / this.global.unit
        const playerY = this.pos.y / this.global.unit
        const currentLevel = this.global.currentLevel
        const boardDimensions = this.global.boardDimensions

        const top1 =
            playerY > 1 && currentLevel[playerX][playerY - 1].includes('ground')
                ? {
                      x: playerX,
                      y: playerY - 1
                  }
                : false
        const top2 =
            playerY > 2 &&
            currentLevel[playerX][playerY - 2].includes('ground') &&
            top1
                ? {
                      x: playerX,
                      y: playerY - 2
                  }
                : false
        const top3 =
            playerY > 3 &&
            currentLevel[playerX][playerY - 3].includes('ground') &&
            top1 &&
            top2
                ? {
                      x: playerX,
                      y: playerY - 3
                  }
                : false
        const bottom1 =
            playerY < boardDimensions.y &&
            currentLevel[playerX][playerY + 1].includes('ground')
                ? {
                      x: playerX,
                      y: playerY + 1
                  }
                : false
        const bottom2 =
            playerY < boardDimensions.y - 1 &&
            currentLevel[playerX][playerY + 2].includes('ground') &&
            bottom1
                ? {
                      x: playerX,
                      y: playerY + 2
                  }
                : false
        const bottom3 =
            playerY < boardDimensions.y - 2 &&
            currentLevel[playerX][playerY + 3].includes('ground') &&
            bottom1 &&
            bottom2
                ? {
                      x: playerX,
                      y: playerY + 3
                  }
                : false
        const left1 =
            playerX > 1 && currentLevel[playerX - 1][playerY].includes('ground')
                ? {
                      x: playerX - 1,
                      y: playerY
                  }
                : false
        const left2 =
            playerX > 2 &&
            currentLevel[playerX - 2][playerY].includes('ground') &&
            left1
                ? {
                      x: playerX - 2,
                      y: playerY
                  }
                : false
        const left3 =
            playerX > 3 &&
            currentLevel[playerX - 3][playerY].includes('ground') &&
            left1 &&
            left2
                ? {
                      x: playerX - 3,
                      y: playerY
                  }
                : false
        const right1 =
            playerX < boardDimensions.x &&
            currentLevel[playerX + 1][playerY].includes('ground')
                ? {
                      x: playerX + 1,
                      y: playerY
                  }
                : false
        const right2 =
            playerX < boardDimensions.x - 1 &&
            currentLevel[playerX + 2][playerY].includes('ground') &&
            right1
                ? {
                      x: playerX + 2,
                      y: playerY
                  }
                : false
        const right3 =
            playerX < boardDimensions.x - 2 &&
            currentLevel[playerX + 3][playerY].includes('ground') &&
            right1 &&
            right2
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

    getClicked(x, y) {
        if (!this.isHover(x, y)) return false
        else {
            return {
                x,
                y
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
}
