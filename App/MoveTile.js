export default class MoveTile {
    constructor(x, y, unit, color) {
        this.x = x
        this.y = y
        this.unit = unit
        this.color = color
    }

    draw(context, mouseX, mouseY) {
        context.beginPath()
        context.fillStyle = this.isPointInside(mouseX, mouseY)
            ? 'rgba(255, 255, 255, 0.5)'
            : this.color
        context.fillRect(
            this.x * this.unit,
            this.y * this.unit,
            this.unit,
            this.unit
        )
        context.stroke()
    }

    getOptionsClicked(x, y) {
        if (!this.isPointInside(x, y)) return
        else {
            return {
                x: this.x,
                y: this.y
            }
        }
    }

    isPointInside(x, y) {
        return (
            x / this.unit >= this.x &&
            x / this.unit <= this.x + 1 &&
            y / this.unit >= this.y &&
            y / this.unit <= this.y + 1
        )
    }
}
