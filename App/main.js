import SpriteSheet from './SpriteSheet'
import { loadImage } from './utils/loaders'

const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

loadImage('App/assets/tileset.png').then((image) => {
    const sprites = new SpriteSheet(image, 16, 16)
    sprites.define('ground', 1, 4) // (name, x, y)
    // sprites.drawTile('ground', context, 42, 62)

    sprites.define('char1', 8, 1)
    sprites.define('char2', 9, 1)
    sprites.define('char3', 10, 1)
    sprites.define('char4', 11, 1)
    sprites.define('char5', 12, 1)
    sprites.define('char6', 13, 1)
    sprites.define('char7', 14, 1)
    sprites.define('char8', 15, 1)

    // sprites.draw('char1', context, 42, 86)

    animate(context, sprites)
})

function animate(context, sprites) {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            context.fillStyle = '#FFffff'
            context.fillRect(42, 86, 16, 16)
            sprites.draw(`char${i + 1}`, context, 42, 86)

            if (i === 7) animate(context, sprites)
        }, 200 * i)
    }
}
