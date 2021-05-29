import './styles/style.scss'
import tileset from './assets/tileset.png'

import SpriteSheet from './SpriteSheet'
import Character from './Character'
import Board from './Board'
import { loadImage } from './utils/loaders'
import { getSpritesKeys } from './utils/utils'
import { tiles, charactersSprites, moveTileSprites } from './levels/definitions'

const canvas = document.getElementById('game')
const context = canvas.getContext('2d')
const fps = 200
const unit = 32
let mousePos = {
    x: 0,
    y: 0
}
let playersInstances = []
let currentPlayer = 1
const board = new Board({ x: 12, y: 12 })
const currentLevel = board.getCurrentLevel()
const boardDimensions = board.getDimensions()
resizeCanvas(boardDimensions)

function getGlobal() {
    return {
        board,
        fps,
        currentLevel,
        boardDimensions,
        unit,
        mousePos,
        currentPlayer,
        playersInstances
    }
}

function resizeCanvas(boardDimensions) {
    canvas.width = boardDimensions.x * unit + unit
    canvas.height = boardDimensions.y * unit + unit
}

function initPlayers(playersClasses, sprites) {
    const players = []

    playersClasses.forEach((player, index) => {
        players.push(
            new Character(
                index + 1,
                player.classe,
                10,
                [],
                player.x * unit,
                player.y * unit,
                getSpritesKeys(sprites, player.classe),
                getGlobal()
            )
        )
    })

    return players
}

function render(characters, context, sprites) {
    board.draw(currentLevel, sprites, context)
    for (let char of characters) {
        char.draw(context, sprites)
        char.setGlobal(getGlobal())
    }

    requestAnimationFrame(() => render(characters, context, sprites))
}

loadImage(tileset).then((image) => {
    const sprites = new SpriteSheet(image, unit, unit, unit)

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

    for (let tile in moveTileSprites) {
        sprites.define(tile, moveTileSprites[tile].x, moveTileSprites[tile].y)
    }

    playersInstances = initPlayers(
        [
            { classe: 'elf', x: 3, y: 3 },
            { classe: 'wizard', x: 3, y: 7 }
        ],
        sprites
    )

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect()
        mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        for (let char of playersInstances) {
            char.setMousePos(mousePos)
        }
    })

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect()
        mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        for (let char of playersInstances) {
            if (char) {
                char.setMousePos(mousePos)
                for (let option in char.getMoveOptions()) {
                    let ite = char.getMoveOptions()[option]
                    if (char.getClicked(ite.x, ite.y)) {
                        char.setPos({ x: ite.x * unit, y: ite.y * unit })
                        if (currentPlayer === playersInstances.length) {
                            currentPlayer = 1
                        } else {
                            currentPlayer += 1
                        }
                        char.setGlobal(getGlobal())
                    }
                }
            }
        }
    })

    render(playersInstances, context, sprites)
})
