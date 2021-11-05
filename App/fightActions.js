function printInstructions(
    instructionContainer,
    currentPlayer,
    isFinish = { value: false, winner: null }
) {
    if (!isFinish.value) {
        const currentClass = currentPlayer === 1 ? 'red' : 'blue'
        const playerClass = currentPlayer === 1 ? 'player-one' : 'player-two'
        const instructionTemplate = () => `
            <div class="${currentClass}">
                Player <span>${currentPlayer}</span><span class='player-bullet ${playerClass}'><span> turn
            </div>
        `

        instructionContainer.innerHTML = instructionTemplate()
    } else {
        const currentClass = currentPlayer === 1 ? 'red' : 'blue'
        const instructionTemplate = () => `
            <div class="${currentClass}">
                Player <span>${currentPlayer}</span> win !
            </div>
        `

        instructionContainer.innerHTML = instructionTemplate()
    }
}

export function handleFightActions(
    mainContainer,
    acitonsContainer,
    instructionContainer,
    attack,
    defend,
    currentPlayer,
    playersInstances,
    playersContainers,
    isInAction
) {
    printInstructions(instructionContainer, currentPlayer)

    attack.addEventListener('click', () => {
        if (isInAction) return
        isInAction = true
        console.log(isInAction)
        if (currentPlayer === 1) {
            playersContainers[0].style.animationName = 'attackFromLeft'
            setTimeout(() => {
                mainContainer.classList = 'main-container blue'
                acitonsContainer.classList = 'action right'
                playersContainers[0].style.animationName = ''
                attackAction(
                    playersInstances,
                    currentPlayer,
                    playersContainers[1]
                )
                currentPlayer = 2
                isInAction = false
            }, 1000)
        } else if (currentPlayer === 2) {
            playersContainers[1].style.animationName = 'attackFromRight'
            setTimeout(() => {
                mainContainer.classList = 'main-container red'
                acitonsContainer.classList = 'action left'
                playersContainers[1].style.animationName = ''
                attackAction(
                    playersInstances,
                    currentPlayer,
                    playersContainers[0]
                )
                currentPlayer = 1
                isInAction = false
            }, 1000)
        }
        printInstructions(instructionContainer, currentPlayer)
    })

    defend.addEventListener('click', () => {
        if (isInAction) return
        isInAction = true
        if (currentPlayer === 1) {
            playersContainers[0].style.animationName = 'defend'
            setTimeout(() => {
                acitonsContainer.classList = 'action right'
                playersContainers[0].style.animationName = ''
                defendAction(playersInstances, currentPlayer)
                currentPlayer = 2
                isInAction = false
            }, 1000)
        } else if (currentPlayer === 2) {
            playersContainers[1].style.animationName = 'defendInverted'
            setTimeout(() => {
                acitonsContainer.classList = 'action left'
                playersContainers[1].style.animationName = ''
                defendAction(playersInstances, currentPlayer)
                currentPlayer = 1
                isInAction = false
            }, 1000)
        }
        printInstructions(instructionContainer, currentPlayer)
    })
}

function attackAction(playersInstances, currentPlayer, targetNodeElement) {
    const initiator = playersInstances.find(
        (player) => player.player === currentPlayer
    )
    const target = playersInstances.find(
        (player) => player.player !== currentPlayer
    )

    if (initiator.isDefending) initiator.isDefending = false
    if (target.isDefending) target.hp -= initiator.dmg / 2
    else target.hp -= initiator.dmg

    if (target.hp <= 0) {
        target.hp = 0
        targetNodeElement.classList.add('death')
        setTimeout(() => {
            endGame(initiator, target)
        }, 1500)
    }

    console.log(
        `Player ${initiator.player} (${initiator.classe}) attack Player ${target.player} (${target.classe}) with his ${initiator.weapon} and inflict ${initiator.dmg} damage points`
    )
}

function defendAction(playersInstances, currentPlayer) {
    const initiator = playersInstances.find(
        (player) => player.player === currentPlayer
    )

    initiator.isDefending = true
}

function endGame(initiator, target) {
    const endOverlay = document.querySelector('.end-game-overlay')
    const endContainer = document.querySelector('.end-game')
    endContainer.innerHTML = `
        Player ${initiator.player} win !
        <button class="reset-button">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front">
                Play again !
            </span>
        </button>
    `
    const resetButton = document.querySelector('.reset-button')
    resetButton.addEventListener('click', () => {
        window.location.reload()
    })
    endOverlay.classList.add('visible')
}
