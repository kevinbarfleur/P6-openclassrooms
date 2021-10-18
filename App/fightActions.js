export const initSelectors = (acitonsContainer, attack, defend, globals) => {
    attack.addEventListener('click', () => {
        if (globals.currentPlayer === 1) {
            acitonsContainer.classList = 'action right'
            globals.currentPlayer = 2
        } else if (globals.currentPlayer === 2) {
            acitonsContainer.classList = 'action left'
            globals.currentPlayer = 1
        }

        console.log('player', globals.currentPlayer)
    })
}
