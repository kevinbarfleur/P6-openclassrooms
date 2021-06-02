export const handleConfiguration = (board, resizeCanvas) => {
    const generateButton = document.querySelector('.generate-button')
    const boardX = document.querySelector('.board-size-x')
    const boardY = document.querySelector('.board-size-y')

    generateButton.addEventListener('click', () => {
        const size = {
            x: boardX.value,
            y: boardY.value
        }

        board.setDimensions(size)
        resizeCanvas(size)
    })
}
