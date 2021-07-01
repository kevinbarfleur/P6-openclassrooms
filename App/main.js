import './styles/style.scss'
import tileset from './assets/tileset.png'

import SpriteSheet from './SpriteSheet'
import Character from './Character'
import Weapon from './Weapon'
import Board from './Board'
import { loadImage } from './utils/loaders'
import { getSpritesKeys } from './utils/utils'
import {
    tiles,
    charactersSprites,
    moveTileSprites,
    decorations,
    weapons
} from './levels/definitions'

const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

const fps = 200
const unit = 32
let mousePos = {
    x: 0,
    y: 0
}

let playersInstances = []
let weaponsInstances = []
let currentPlayer = 1
const pikesDensity = '10%'
const size = 12
let board = new Board({ x: size, y: size }, pikesDensity)
const currentLevel = board.getCurrentLevel()
const boardDimensions = board.getDimensions()
const sword = new Weapon(8, 8, 'sword', getGlobal())
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
        playersInstances,
        weaponsInstances
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

function initWeapons(weaponsNames) {
    const weapons = []

    weaponsNames.forEach((weapon) => {
        weapons.push(new Weapon(weapon, getGlobal()))
    })

    return weapons
}

function isFighting() {
    let isFighting = false
    const pos = []

    for (let char of playersInstances) {
        pos.push(char.getPos())
    }

    if (pos.length === playersInstances.length) {
        const distance = Math.hypot(pos[0].x - pos[1].x, pos[0].y - pos[1].y)
        if (distance === unit) {
            isFighting = true
        }
    }

    return isFighting
}

function render(characters, weapons, context, sprites) {
    board.draw(currentLevel, sprites, context)
    for (let char of characters) {
        char.draw(context, sprites)
        char.setGlobal(getGlobal())
    }
    for (let weapon of weapons) {
        weapon.draw(context, sprites)
        weapon.setGlobal(getGlobal())
    }

    requestAnimationFrame(() => render(characters, weapons, context, sprites))
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

    for (let deco in decorations) {
        sprites.define(deco, decorations[deco].x, decorations[deco].y)
    }

    for (let weapon in weapons) {
        sprites.define(weapon, weapons[weapon].x, weapons[weapon].y)
    }

    playersInstances = initPlayers(
        [{ classe: 'elf' }, { classe: 'wizard' }],
        sprites
    )

    weaponsInstances = initWeapons(['sword', 'mace', 'axe', 'goldSword'])

    for (let player of playersInstances) {
        player.setGlobal(getGlobal())
        player.placeCharacter()
    }

    playersInstances[0].getMoveOptions2()

    for (let weapon of weaponsInstances) {
        weapon.setGlobal(getGlobal())
        weapon.placeWeapon()
    }

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
                        char.setPos({
                            x: ite.x * unit,
                            y: ite.y * unit
                        })
                        let tempPlayer = currentPlayer
                        if (currentPlayer === playersInstances.length) {
                            currentPlayer = 1
                        } else {
                            currentPlayer += 1
                        }
                        char.setGlobal(getGlobal())
                        if (isFighting()) {
                            setTimeout(() => {
                                alert(`Player ${tempPlayer} launch a fight ! `)
                            }, fps)
                        }
                        // console.log(char.getMoveOptions2(), ite.x, ite.y)
                        // const movesOptions = []
                        // for (let option in char.getMoveOptions2()) {
                        //     if (char.getMoveOptions2()[option]) {
                        //         movesOptions.push(
                        //             char.getMoveOptions2()[option]
                        //         )
                        //     }
                        // }
                        // console.log(option)
                    }
                }
            }
        }
    })

    render(playersInstances, weaponsInstances, context, sprites)
})
