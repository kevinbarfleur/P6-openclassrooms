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

export function getDistance(players, unit, dimensions) {
    let farEnoughAway = false
    const pos = []

    for (let char of players) {
        if (char.getPos().x && char.getPos().y) {
            pos.push({
                x: char.getPos().x / unit,
                y: char.getPos().y / unit
            })
        }
    }

    if (pos.length === players.length) {
        let smaller = dimensions.x >= dimensions.y ? dimensions.y : dimensions.x
        if (Math.hypot(pos[0].x - pos[1].x, pos[0].y - pos[1].y) < smaller) {
            farEnoughAway = true
        }
    }

    return farEnoughAway
}

export function getMoveSteps(player, destinationX, destinationY, global) {
    let direction,
        steps = 0

    const playerX = player.pos.x / global.unit
    const playerY = player.pos.y / global.unit

    if (playerX !== destinationX) {
        direction = 'x'
        steps = playerX - destinationX
    } else {
        direction = 'y'
        steps = playerY - destinationY
    }

    return { steps, direction }
}
