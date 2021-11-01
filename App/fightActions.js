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
    acitonsContainer,
    instructionContainer,
    attack,
    defend,
    currentPlayer,
    playersInstances
) {
    printInstructions(instructionContainer, currentPlayer)

    attack.addEventListener('click', () => {
        if (currentPlayer === 1) {
            acitonsContainer.classList = 'action right'
            attackAction(playersInstances, currentPlayer)
            currentPlayer = 2
        } else if (currentPlayer === 2) {
            acitonsContainer.classList = 'action left'
            attackAction(playersInstances, currentPlayer)
            currentPlayer = 1
        }

        printInstructions(instructionContainer, currentPlayer)
    })

    defend.addEventListener('click', () => {
        if (currentPlayer === 1) {
            acitonsContainer.classList = 'action right'
            defendAction(playersInstances, currentPlayer)
            currentPlayer = 2
        } else if (currentPlayer === 2) {
            acitonsContainer.classList = 'action left'
            defendAction(playersInstances, currentPlayer)
            currentPlayer = 1
        }

        printInstructions(instructionContainer, currentPlayer)
    })
}

function attackAction(playersInstances, currentPlayer) {
    const initiator = playersInstances.find(
        (player) => player.player === currentPlayer
    )
    const target = playersInstances.find(
        (player) => player.player !== currentPlayer
    )

    if (initiator.isDefending) initiator.isDefending = false
    if (target.isDefending) target.hp -= initiator.dmg / 2
    else target.hp -= initiator.dmg

    if (target.hp <= 0) endGame(initiator, target)

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
    target.hp = 0
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