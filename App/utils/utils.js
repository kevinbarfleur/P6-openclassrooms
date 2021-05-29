export function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

export function getSpritesKeys(sprites, keyword) {
    return Array.from(sprites.tiles.keys()).filter((key) =>
        key.includes(keyword)
    )
}
