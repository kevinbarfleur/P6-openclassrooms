import { getRandomInt } from './utils/utils.js'

export default class Board {
    constructor(dimensions) {
        this.dimensions = dimensions
        this.currentLevel = this.generateLevel()
    }

    draw(currentLevel, sprites, context) {
        for (let i = 0; i <= currentLevel.length; i++) {
            for (let j = 0; j < currentLevel.length; j++) {
                if (currentLevel[j][i]) {
                    if (j !== 0)
                        sprites.drawTile('ground1', context, i * 2, j * 2)
                    sprites.drawTile(currentLevel[i][j], context, i * 2, j * 2)
                }
            }
        }
    }

    generateLevel() {
        const x = this.dimensions.x
        const y = this.dimensions.y

        let board = new Array(2)

        for (let i = 0; i <= x; i++) {
            board[i] = new Array(1)
            for (let j = 0; j <= y; j++) {
                board[j] = new Array(y)
            }
        }

        for (let i = 0; i <= x; i++) {
            for (let j = 0; j <= y; j++) {
                let tile

                if (i === 0 && j === 0) {
                    tile = 'cornerTopLeft_1'
                } else if (i === x && j === 0) {
                    tile = 'cornerTopRight_1'
                } else if (i !== 0 && i !== x && j === 0) {
                    tile = `wall2_top`
                } else if (i !== 0 && i !== x && j === 1) {
                    tile = `wall${getRandomInt(2, 5)}_bottom`
                } else if (i === 0 && j === 1) {
                    tile = 'cornerTopLeft_2'
                } else if (i === x && j === 1) {
                    tile = 'cornerTopRight_2'
                } else if (i === 0 && j === y - 1) {
                    tile = 'cornerBottomLeft_1'
                } else if (i === 0 && j === y) {
                    tile = 'cornerBottomLeft_2'
                } else if (i === x && j === y - 1) {
                    tile = 'cornerBottomRight_1'
                } else if (i === x && j === y) {
                    tile = 'cornerBottomRight_2'
                } else if (j === y - 1) {
                    tile = `wall2_top`
                } else if (j === y) {
                    tile = `wall${getRandomInt(2, 5)}_bottom`
                } else if (i === 0) {
                    tile = 'verticalLeft'
                } else if (i === x) {
                    tile = 'verticalRight'
                } else {
                    const randPikes = getRandomInt(1, 12)
                    const rand = getRandomInt(1, 10)
                    let pikes
                    if (randPikes > 6) {
                        pikes = 'pike1'
                    } else {
                        pikes = 'pike2'
                    }
                    if (rand <= 1) {
                        tile = pikes
                    } else {
                        tile = `ground${getRandomInt(1, 9)}`
                    }
                }

                board[i][j] = tile
            }
        }

        return board
    }

    getCurrentLevel() {
        return this.currentLevel
    }
    getDimensions() {
        return this.dimensions
    }
}
