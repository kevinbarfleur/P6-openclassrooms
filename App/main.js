import './styles/style.scss'

import SpriteSheet from './SpriteSheet'
import Character from './Character'
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

            // const item = {
            //     i,
            //     j
            // }

            // switch (item) {
            //     case value:
            //         break

            //     default:
            //         break
            // }

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

function getSpritesKeys(sprites, keyword) {
    return Array.from(sprites.tiles.keys()).filter((key) =>
        key.includes(keyword)
    )
}

const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

const fps = 200
const unit = 16
let boardDimensions = {
    x: 12,
    y: 12
}
let mousePos = {
    x: 0,
    y: 0
}

let currentLevel = generateLevel(boardDimensions.x, boardDimensions.y)

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

    const char1 = new Character(
        'elf',
        10,
        [],
        3 * unit,
        3 * unit,
        getSpritesKeys(sprites, 'elf'),
        { drawBoard, fps, currentLevel, boardDimensions, unit, mousePos }
    )
    char1.draw(context, sprites, mousePos)

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect()
        mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        if (char1) {
            char1.setMousePos(mousePos)
        }
    })

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect()
        mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        if (char1) {
            char1.setMousePos(mousePos)
            for (let option in char1.getMoveOptions()) {
                let ite = char1.getMoveOptions()[option]

                if (char1.getClicked(ite.x, ite.y))
                    char1.setPos({ x: ite.x * unit, y: ite.y * unit })
            }
        }
    })
})
