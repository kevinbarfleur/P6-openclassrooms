import './styles/style.scss'

import SpriteSheet from './SpriteSheet'
import MoveTile from './MoveTile'
import { loadImage } from './utils/loaders'
import { tiles, charactersSprites } from './levels/definitions'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function drawBoard(currentLevel, sprites, context) {
    for (let i = 0; i <= currentLevel.length; i++) {
        for (let j = 0; j < currentLevel.length; j++) {
            if (currentLevel[j][i]) {
                if (j !== 0) sprites.drawTile('ground1', context, i, j)
                sprites.drawTile(currentLevel[i][j], context, i, j)
            }
        }
    }
}

function generateLevel(x, y) {
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
                const rand = getRandomInt(1, 10)
                if (rand <= 1) {
                    tile = `pikeBig`
                } else {
                    tile = `ground${getRandomInt(1, 9)}`
                }
            }

            board[i][j] = tile
        }
    }

    return board
}

function drawCharacter(name, frames, context, sprites) {
    for (let i = 0; i < frames; i++) {
        setTimeout(() => {
            drawBoard(currentLevel, sprites, context)
            sprites.draw(
                `${name + (i + 1)}`,
                context,
                players['1'].x,
                players['1'].y
            )

            drawMoveOptions(context)

            if (i === frames - 1)
                drawCharacter(
                    'elf',
                    frames,
                    context,
                    sprites,
                    players['1'].x,
                    players['1'].y
                )
        }, fps * i)
    }
}

function drawMoveOptions(context) {
    getMoveOptions(context)
    for (let option of moveOptionsTiles) {
        option.draw(context, mousePos.x, mousePos.y)
    }
}

function getMoveOptions(context) {
    const playerX = players['1'].x / unit
    const playerY = players['1'].y / unit

    players['1'].moves = {
        top1:
            playerY > 1 && currentLevel[playerX][playerY - 1].includes('ground')
                ? {
                      x: playerX,
                      y: playerY - 1
                  }
                : false,
        top2:
            playerY > 2 && currentLevel[playerX][playerY - 2].includes('ground')
                ? {
                      x: playerX,
                      y: playerY - 2
                  }
                : false,
        top3:
            playerY > 3 && currentLevel[playerX][playerY - 3].includes('ground')
                ? {
                      x: playerX,
                      y: playerY - 3
                  }
                : false,
        bottom1:
            playerY < boardDimensions.y &&
            currentLevel[playerX][playerY + 1].includes('ground')
                ? {
                      x: playerX,
                      y: playerY + 1
                  }
                : false,
        bottom2:
            playerY < boardDimensions.y - 1 &&
            currentLevel[playerX][playerY + 2].includes('ground')
                ? {
                      x: playerX,
                      y: playerY + 2
                  }
                : false,
        bottom3:
            playerY < boardDimensions.y - 2 &&
            currentLevel[playerX][playerY + 3].includes('ground')
                ? {
                      x: playerX,
                      y: playerY + 3
                  }
                : false,
        left1:
            playerX > 1 && currentLevel[playerX - 1][playerY].includes('ground')
                ? {
                      x: playerX - 1,
                      y: playerY
                  }
                : false,
        left2:
            playerX > 2 && currentLevel[playerX - 2][playerY].includes('ground')
                ? {
                      x: playerX - 2,
                      y: playerY
                  }
                : false,
        left3:
            playerX > 3 && currentLevel[playerX - 3][playerY].includes('ground')
                ? {
                      x: playerX - 3,
                      y: playerY
                  }
                : false,
        right1:
            playerX < boardDimensions.x &&
            currentLevel[playerX + 1][playerY].includes('ground')
                ? {
                      x: playerX + 1,
                      y: playerY
                  }
                : false,
        right2:
            playerX < boardDimensions.x - 1 &&
            currentLevel[playerX + 2][playerY].includes('ground')
                ? {
                      x: playerX + 2,
                      y: playerY
                  }
                : false,
        right3:
            playerX < boardDimensions.x - 2 &&
            currentLevel[playerX + 3][playerY].includes('ground')
                ? {
                      x: playerX + 3,
                      y: playerY
                  }
                : false
    }

    moveOptionsTiles = []
    const options = players['1'].moves
    Object.keys(options).forEach((pos) => {
        if (options[pos] !== false) {
            moveOptionsTiles.push(
                new MoveTile(
                    options[pos].x,
                    options[pos].y,
                    unit,
                    'rgba(255,255,255,0.2)'
                )
            )
        }
    })
}

const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

const fps = 200
const unit = 16
let moveOptionsTiles = []
let boardDimensions = {
    x: 12,
    y: 12
}
let players = {
    1: {
        x: 3 * unit,
        y: 3 * unit,
        moves: {}
    }
}
let mousePos = {
    x: 0,
    y: 0
}

let currentLevel = generateLevel(boardDimensions.x, boardDimensions.y)

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect()
    mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }

    for (let option of moveOptionsTiles) {
        if (option.getOptionsClicked(mousePos.x, mousePos.y)) {
            players['1'].x =
                option.getOptionsClicked(mousePos.x, mousePos.y).x * unit
            players['1'].y =
                option.getOptionsClicked(mousePos.x, mousePos.y).y * unit
        }
    }
})

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
})

document.addEventListener('keyup', (e) => {
    const playerX = players['1'].x / unit
    const playerY = players['1'].y / unit

    switch (e.key) {
        case 'ArrowUp':
            if (playerY > 2) players['1'].y -= 1 * unit
            break
        case 'ArrowDown':
            if (playerY < boardDimensions.y - 2) players['1'].y += 1 * unit
            break
        case 'ArrowLeft':
            if (playerX > 1) players['1'].x -= 1 * unit
            break
        case 'ArrowRight':
            if (playerX < boardDimensions.x - 1) players['1'].x += 1 * unit
            break
        default:
            break
    }
})

loadImage('App/assets/tileset.png').then((image) => {
    const sprites = new SpriteSheet(image, unit, unit)

    // Define all level tiles
    for (let tile in tiles) {
        sprites.define(tile, tiles[tile].x, tiles[tile].y)
    }

    // Define all characters sprites
    for (let char in charactersSprites) {
        Object.keys(charactersSprites[char]).forEach((frame, index) => {
            sprites.define(
                `${char + (index + 1)}`,
                charactersSprites[char][frame].x,
                charactersSprites[char][frame].y
            )
        })
    }

    drawBoard(currentLevel, sprites, context)
    drawCharacter('elf', 7, context, sprites, players['1'].x, players['1'].y)
})
