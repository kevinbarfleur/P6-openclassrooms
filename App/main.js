import './styles/style.scss'
import tileset from './assets/tileset.png'

import SpriteSheet from './SpriteSheet'
import Character from './Character'
import Weapon from './Weapon'
import Board from './Board'
import { loadImage } from './utils/loaders'
import { getSpritesKeys, getMoveSteps, decreaseVolume } from './utils/utils'
import { handleFightActions } from './fightActions'
import { handleCharactersChoice } from './config'
import {
    tiles,
    charactersSprites,
    moveTileSprites,
    decorations,
    weapons
} from './levels/definitions'

// Characters gifs
import elfGif from './assets/elf_gif.gif'
import warriorGif from './assets/warrior_gif.gif'
import wizardGif from './assets/wizard_gif.gif'
import monsterGif from './assets/monster_gif.gif'

// Init all sounds
import boardMusicURL from './assets/musics/boardMusic.mp3'
const boardMusic = new Audio(boardMusicURL)
boardMusic.loop = true
boardMusic.volume = 0.6
boardMusic.play()
import fightMusicURL from './assets/musics/fightMusic.mp3'
const fightMusic = new Audio(fightMusicURL)
fightMusic.volume = 0.6
import hitSoundURL from './assets/musics/hit.mp3'
const hitSound = new Audio(hitSoundURL)
import endMusicURL from './assets/musics/endMusic.mp3'
const endMusic = new Audio(endMusicURL)
import clickSoundURL from './assets/musics/clickSound.wav'
const clickSound = new Audio(clickSoundURL)
const allButtons = document.querySelectorAll('.clickSound')
allButtons.forEach((item) => {
    item.addEventListener('click', () => {
        clickSound.play()
    })
})

const boardCanvas = document.getElementById('board')
const context = boardCanvas.getContext('2d')
export const infoContainer = document.querySelector('.panel-info')
const mainContainer = document.querySelector('.main-container')
const fightContainer = document.getElementById('fight')
const instructionContainer = document.querySelector('.instruction')
const actionContainer = document.querySelector('.action')
const attackButton = document.querySelector('.attack')
const defendButton = document.querySelector('.defend')
const playersContainers = document.querySelectorAll('.player-container')
const initContainer = document.querySelector('.initialization')
const nextStep = document.querySelector('.nextStep')
const startGame = document.querySelector('.startGame')
const fps = 200
const playerMoveSpeed = 1.4
const unit = 32
let mousePos = { x: 0, y: 0 }
let gamePhase = 'board'
let playersInstances = []
let weaponsInstances = []
let currentPlayer = 1
let isInAction = false
let characterChoiceStep = 1
let playersConfig = {
    1: {
        character: ''
    },
    2: {
        character: ''
    }
}
const pikesDensity = '10%'
const size = 12
const board = new Board({ x: size, y: size }, pikesDensity, gamePhase)
const currentLevel = board.getCurrentLevel()
const boardDimensions = board.getDimensions()
let fpsInterval, now, then, elapsed, startTime
resizeCanvas(boardDimensions)

//Handle game init (Choose characters)
handleCharactersChoice(characterChoiceStep, playersConfig, nextStep, startGame)
nextStep.addEventListener('click', () => {
    characterChoiceStep += 1
    handleCharactersChoice(
        characterChoiceStep,
        playersConfig,
        nextStep,
        startGame
    )
})

export function getGlobal() {
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
    boardCanvas.width = boardDimensions.x * unit + unit
    boardCanvas.height = boardDimensions.y * unit + unit
}

function initPlayers(playersClasses, sprites) {
    const players = []

    playersClasses.forEach((player, index) => {
        players.push(
            new Character(
                index + 1,
                player.classe,
                player.weapon,
                100,
                player.x * unit,
                player.y * unit,
                getSpritesKeys(sprites, player.classe),
                getGlobal()
            )
        )
    })

    return players
}

function initWeapons(weaponsOptions) {
    const weapons = []

    weaponsOptions.forEach((weapon) => {
        weapons.push(new Weapon(weapon, getGlobal(), weapon.isHeld))
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

function nextPlayer() {
    if (currentPlayer === playersInstances.length) {
        currentPlayer = 1
    } else {
        currentPlayer += 1
    }
}

function updateGlobalVariables() {
    for (let char of playersInstances) {
        char.setGlobal(getGlobal())
    }
    for (let weapon of weaponsInstances) {
        weapon.setGlobal(getGlobal())
    }
}

function handlePlayerMove(char, ite, sprites) {
    const { direction, steps } = getMoveSteps(char, ite.x, ite.y, getGlobal())
    char.isMoving = true
    setTimeout(() => {
        for (let character of playersInstances) {
            if (character.player !== char.player) {
                character.isMoving = false
            }
        }

        nextPlayer()
        updateGlobalVariables()
    }, Math.abs(steps) * fps * playerMoveSpeed)

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
                    if (char.weapon !== 'fist' && char.weapon !== 'head') {
                        let currentWeapon = weaponsInstances.filter(
                            (weapon) => weapon.weapon === char.weapon
                        )
                        setTimeout(() => {
                            if (currentWeapon[0]) {
                                currentWeapon[0].isHeld = false
                                currentWeapon[0].setPos({
                                    x: char.getPos().x,
                                    y: char.getPos().y
                                })
                            }
                        }, 100)
                    }

                    char.weapon = weapon.weapon
                    char.dmg = weapon.dmg
                    if (weapon) weapon.isHeld = true
                }
            }

            handleGamePhase(isFighting(), currentPlayer, fps)
            printInfo(infoContainer, playersInstances)
        }, i * fps * 2)
    }
}

function printInfo(container, playersInstances) {
    container.innerHTML = ''

    const template = (player, playerClass, classe, life, weapon, dmg) => `
        <div class="player-info">
            <div class='player-label'>
                <div class='player-label-bullet ${playerClass}'></div>Player ${player} <span class="class-name">${classe}</span>
            </div>
            <div class="life-container">
                <div class="life-bar">
                    <div class="life-value" style="width:${life}%;">
                </div>
                </div><span>${life}hp</span>
            </div>
            <div class='weapon-label'>
               <span class='weapon-name'>${
                   weapon || 'Claws'
               }</span> - <span class="value">${dmg}</span> damages
            </div>
        </div>
    `

    for (let player of playersInstances) {
        const playerClass = player.player === 1 ? 'player-one' : 'player-two'

        container.innerHTML += template(
            player.player,
            playerClass,
            player.classe,
            player.hp,
            player.weapon,
            player.dmg
        )
    }
}

function handleGamePhase(isFighting, fps) {
    if (isFighting) {
        setTimeout(() => {
            decreaseVolume(boardMusic)
            gamePhase = 'fight'
            boardCanvas.classList.add('fade-out')
            fightMusic.loop = true
            fightMusic.play()
            setTimeout(() => {
                boardCanvas.classList.remove('active')
            }, 600)
            setTimeout(() => {
                fightContainer.classList.add('active')
                setTimeout(() => {
                    fightContainer.classList.add('fade-in')
                }, 100)
            }, 600)
        }, fps)
        return
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

        board.gamePhase = gamePhase
        board.draw(currentLevel, sprites, context)

        for (let char of characters) {
            char.draw(context, sprites)
        }
        for (let weapon of weapons) {
            if (!weapon.isHeld) weapon.draw(context, sprites)
        }
    }

    printInfo(infoContainer, playersInstances)
}

loadImage(tileset).then((image) => {
    startGame.addEventListener('click', () => {
        boardCanvas.classList.remove('hidden')
        boardCanvas.classList.remove('opacity0')
        initContainer.classList.add('hidden')

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
            sprites.define(
                tile,
                moveTileSprites[tile].x,
                moveTileSprites[tile].y
            )
        }

        for (let deco in decorations) {
            sprites.define(deco, decorations[deco].x, decorations[deco].y)
        }

        for (let weapon in weapons) {
            sprites.define(weapon, weapons[weapon].x, weapons[weapon].y)
        }

        const getStarter = (character) => {
            switch (character) {
                case 'elf':
                    return 'knife'
                case 'warrior':
                    return 'knife'
                case 'wizard':
                    return 'staff'
                case 'monster':
                    return ''
                default:
                    return 'knife'
            }
        }

        playersInstances = initPlayers(
            [
                {
                    classe: playersConfig[1].character,
                    weapon: getStarter(playersConfig[1].character)
                },
                {
                    classe: playersConfig[2].character,
                    weapon: getStarter(playersConfig[2].character)
                }
            ],
            sprites
        )

        const getGif = (character) => {
            switch (character) {
                case 'elf':
                    return elfGif
                case 'warrior':
                    return warriorGif
                case 'wizard':
                    return wizardGif
                case 'monster':
                    return monsterGif
                default:
                    return
            }
        }

        for (let i = 0; i < playersContainers.length; i++) {
            playersContainers[i].src = getGif(playersConfig[i + 1].character)
            playersContainers[i].alt = `${
                playersConfig[i + 1].character
            } character gif`
        }

        weaponsInstances = initWeapons([
            { name: 'staff', dmg: '10', isHeld: true },
            { name: 'knife', dmg: '10', isHeld: true },
            { name: 'sword', dmg: '30', isHeld: false },
            { name: 'mace', dmg: '20', isHeld: false },
            { name: 'axe', dmg: '40', isHeld: false },
            { name: 'excalibur', dmg: '50', isHeld: false }
        ])

        for (let player of playersInstances) {
            player.setGlobal(getGlobal())
            player.placeCharacter()
        }

        for (let weapon of weaponsInstances) {
            weapon.setGlobal(getGlobal())
            weapon.placeWeapon()
        }

        boardCanvas.addEventListener('mousemove', (e) => {
            const rect = boardCanvas.getBoundingClientRect()
            mousePos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }

            for (let char of playersInstances) {
                char.setMousePos(mousePos)
            }
        })

        boardCanvas.addEventListener('click', (e) => {
            const rect = boardCanvas.getBoundingClientRect()
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
                            handlePlayerMove(char, ite, sprites)
                        }
                    }
                }
            }
        })

        initRendering(8, playersInstances, weaponsInstances, context, sprites)
        handleFightActions(
            mainContainer,
            actionContainer,
            instructionContainer,
            attackButton,
            defendButton,
            currentPlayer,
            playersInstances,
            playersContainers,
            isInAction,
            hitSound,
            fightMusic,
            endMusic
        )
    })
})
