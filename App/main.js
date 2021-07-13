import './styles/style.scss'
import tileset from './assets/tileset.png'

import SpriteSheet from './SpriteSheet'
import Character from './Character'
import Weapon from './Weapon'
import Board from './Board'
import { loadImage } from './utils/loaders'
import { getSpritesKeys, getMoveSteps } from './utils/utils'
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
let mousePos = { x: 0, y: 0 }

let playersInstances = []
let weaponsInstances = []
let currentPlayer = 1
const pikesDensity = '10%'
const size = 12
const board = new Board({ x: size, y: size }, pikesDensity)
const currentLevel = board.getCurrentLevel()
const boardDimensions = board.getDimensions()
let fpsInterval, now, then, elapsed, startTime
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
                player.weapon,
                10,
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

function handlePlayerMove(char, ite) {
    const { direction, steps } = getMoveSteps(char, ite.x, ite.y, getGlobal())
    char.isMoving = true
    setTimeout(() => {
        for (let character of playersInstances) {
            if (character.player !== char.player) {
                character.isMoving = false
            }
        }

        if (currentPlayer === playersInstances.length) {
            currentPlayer = 1
        } else {
            currentPlayer += 1
        }

        for (let char of playersInstances) {
            char.setGlobal(getGlobal())
        }
        for (let weapon of weaponsInstances) {
            weapon.setGlobal(getGlobal())
        }
    }, Math.abs(steps) * fps * 1.4)

    const value = (direction) =>
        steps <= 0
            ? (char.getPos()[direction] / unit + 1) * unit
            : (char.getPos()[direction] / unit - 1) * unit

    for (let i = 0; i <= Math.abs(steps) - 1; i++) {
        setTimeout(() => {
            char.setPos({
                x: direction === 'x' ? value('x') : ite.x * unit,
                y: direction === 'y' ? value('y') : ite.y * unit
            })

            for (let weapon of weaponsInstances) {
                if (
                    !weapon.isHeld &&
                    char.getPos().x === weapon.getPos().x &&
                    char.getPos().y === weapon.getPos().y
                ) {
                    char.weapon = weapon.weapon
                    weapon.isHeld = true
                }
            }

            if (isFighting()) {
                setTimeout(() => {
                    alert(`Player ${currentPlayer} launch a fight ! `)
                }, fps)
                return
            }

            printInfo()
        }, i * fps * 2)
    }
}

function printInfo() {
    const container = document.querySelector('.panel-info')
    container.innerHTML = ''
    const template = (player, classe, life, weapon) => `
    <div class="player-info pixel-borders">
        ${player} <br />
        Class : ${classe} <br />
        Life : <span class="life">${life}</span>Hp <br />
        Weapon: ${weapon}
    </div>
    `

    for (let player of playersInstances) {
        container.innerHTML += template(
            `Player ${player.player}`,
            player.classe,
            player.hp,
            player.weapon
        )
    }
}

function initRendering(
    framesPerSeconds,
    characters,
    weapons,
    context,
    sprites
) {
    fpsInterval = 1000 / framesPerSeconds
    then = Date.now()
    startTime = then
    render(characters, weapons, context, sprites)
}

function render(characters, weapons, context, sprites) {
    requestAnimationFrame(() => render(characters, weapons, context, sprites))

    now = Date.now()
    elapsed = now - then

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)

        board.draw(currentLevel, sprites, context)
        for (let char of characters) {
            char.draw(context, sprites)
        }
        for (let weapon of weapons) {
            weapon.draw(context, sprites)
        }
    }
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
        [
            { classe: 'elf', weapon: 'fist' },
            { classe: 'wizard', weapon: 'head' }
        ],
        sprites
    )

    weaponsInstances = initWeapons(['sword', 'mace', 'axe', 'goldSword'])

    for (let player of playersInstances) {
        player.setGlobal(getGlobal())
        player.placeCharacter()
        console.log(player)
    }

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
                        handlePlayerMove(char, ite)
                    }
                }
            }
        }
    })

    printInfo()
    initRendering(fps, playersInstances, weaponsInstances, context, sprites)
})
