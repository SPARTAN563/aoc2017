class Walker {
    /**
     * 
     * @param {Array<Array<string>>} field 
     */
    constructor(field) {
        this.field = field

        this.x = 0
        this.y = 0

        /** @type {Array<string>} */
        this.path = []
        this.direction = "x+"

        this.findStart()
    }

    findStart() {
        while (this.current() !== "|" && this.peek() !== undefined)
            this.move()

        if (this.current() !== "|")
            throw new Error("Unable to find starting point")

        this.direction = "y+"
    }

    move() {
        switch(this.direction) {
            case "x+":
                this.x++
                break
            case "x-":
                this.x--
                break
            case "y+":
                this.y++
                break
            case "y-":
                this.y--
                break
        }
    }

    oppositeDirection(direction=this.direction) {
        switch(direction[1]) {
            case "+":
                return direction[0] + "-"
            case "-":
                return direction[0] + "+"
        }
    }

    current() {
        return this.field[this.y][this.x]
    }

    peek(direction=this.direction) {
        switch(direction) {
            case "x+":
                return (this.field[this.y] || [])[this.x + 1]
            case "x-":
                return (this.field[this.y] || [])[this.x - 1]
            case "y+":
                return (this.field[this.y + 1] || [])[this.x]
            case "y-":
                return (this.field[this.y - 1] || [])[this.x]
        }
    }

    next() {
        // If we need to change direction, look for another route
        if (!this.peek() || !this.peek().trim()) {
            const options = ["x+", "x-", "y+", "y-"].filter(x => x !== this.oppositeDirection()).filter(x => !!this.peek(x) && !!this.peek(x).trim())
            // console.log("Current: %s (%d, %d)", this.field[this.y][this.x], this.x, this.y)
            // console.log("Options: %s", options.map(x => (`${x} (${this.peek(x)})`)))
            if (!options.length) return false // We have reached the end
            if (options.length > 1) throw new Error("Multiple options available for future travel")
            this.direction = options[0]
        }

        this.move()

        const current = this.current()
        if (/[A-Z]/.test(current)) {
            this.path.push(current)
        }

        return true
    }
}

exports.Walker = Walker

/**
 * Parses a field string into a 2D grid
 * @param {string} field 
 * @returns {Array<Array<string>>}
 */
function parseField(field) {
    return field.split("\n").map(line => line.split(""))
}

exports.parseField = parseField