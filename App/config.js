const charactersContainer = document.querySelector('.characters-list')
const choiceInstruction = document.querySelector('.choice-instruction')
const classes = ['elf', 'wizard', 'warrior', 'monster']

export const handleCharactersChoice = (
    step,
    playersConfig,
    nextStep,
    startGame,
    boardCanvas
) => {
    if (step === 1) {
        handleTemplate(step, classes, playersConfig, nextStep, startGame)
    } else if (step === 2) {
        const targetIntex = classes.indexOf(playersConfig[1].character)
        classes.splice(targetIntex, 1)
        handleTemplate(step, classes, playersConfig, nextStep, startGame)
        nextStep.classList.add('hidden')
        startGame.classList.remove('hidden')
    }
}

const handleTemplate = (step, classes, playersConfig, nextStep, startGame) => {
    let html = ''
    choiceInstruction.innerHTML = `
        <p>Player <span class='player-id'>${step}</span> please select a Heroes:</p>
    `
    let selectedClass
    for (let i = 0; i < classes.length; i++) {
        html += ` <div class="characters-list__item -${classes[i]}" data-character='${classes[i]}'></div>`
    }
    charactersContainer.innerHTML = html

    const selectors = document.querySelectorAll('.characters-list__item')
    selectors.forEach((item) => {
        item.addEventListener('click', () => {
            selectedClass = item.getAttribute('data-character')
            playersConfig[step].character = selectedClass

            if (step === 1) {
                nextStep.removeAttribute('disabled')
            } else if (step === 2) {
                startGame.removeAttribute('disabled')
            }

            selectors.forEach((item) => {
                item.classList.remove('selected')
            })
            item.classList.add('selected')
        })
    })
}
