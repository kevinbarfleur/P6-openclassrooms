export default class SpriteSheet {
    constructor(image, width, height, unit) {
        this.image = image
        this.width = width / 2
        this.height = height / 2
        this.unit = unit
        this.tiles = new Map()
    }

    define(name, x, y) {
        const buffer = document.createElement('canvas')
        buffer.width = this.width
        buffer.height = this.height
        buffer
            .getContext('2d')
            .drawImage(
                this.image,
                x * this.width,
                y * this.height,
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height
            )
        this.tiles.set(name, buffer)
    }

    defineTile(name, x, y) {
        this.define(
            name,
            x * this.width,
            y * this.height,
            this.width,
            this.height
        )
    }

    draw(name, context, x, y) {
        const buffer = this.tiles.get(name)
        context.drawImage(buffer, x, y, this.unit, this.unit)
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height)
    }
}
