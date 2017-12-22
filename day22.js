class Parser {
    /**
     * 
     * @param {string} node 
     * @returns {boolean}
     */
    parseNode(node) {
        switch(node) {
            case ".": return 0
            case "#": return 1
            case "W": return 2
            case "F": return 3
            default: throw new Error(`Unknown node type '${node}'`)
        }
    }

    /**
     * 
     * @param {string} line 
     * @returns {Array<string>}
     */
    parseRow(line) {
        return line.trim().split("").map(x => this.parseNode(x))
    }

    /**
     * @param {string} grid
     * @returns {Array<Array<string>>}
    */
    parseGrid(grid) {
        return grid.split("\n").map(l => this.parseRow(l))
    }
}
exports.Parser = Parser

/**
 * 
 */
class InfiniteGrid {
    /**
     * 
     * @param {Array<Array<number>>} grid 
     */
    constructor(grid) {
        const yOffset = Math.floor(grid.length / 2)
        const xOffset = Math.floor(grid[0].length / 2)

        this.infected = {}
        grid.forEach((row, y) => {
            row.forEach((node, x) => {
                this.set(x - xOffset, y - yOffset, node)
            })
        })
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    get(x, y) {
        return this.infected[`(${x},${y})`] || 0
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} state
     */
    set(x, y, state) {
        if (state)
            this.infected[`(${x},${y})`] = state
        else
            delete this.infected[`(${x},${y})`]

        return state
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y  
     * @returns {number}
     */
    weaken(x, y) {
        return this.set(x, y, 2)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y  
     * @returns {number}
     */
    infect(x, y) {
        return this.set(x, y, 1)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y  
     * @returns {number}
     */
    flag(x, y) {
        return this.set(x, y, 3)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y  
     * @returns {number}
     */
    clean(x, y) {
        return this.set(x, y, 0)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y  
     * @returns {number}
     */
    toggle(x, y) {
        const current = this.get(x, y)
        if (current)
            return this.clean(x, y)
        else
            return this.infect(x, y)
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    evolve(x, y) {
        const current = this.get(x, y)
        switch(current) {
            case 0:
                return this.set(x, y, 2)
            case 1:
                return this.set(x, y, 3)
            case 2:
                return this.set(x, y, 1)
            case 3:
                return this.set(x, y, 0)
        }
    }
}
exports.InfiniteGrid = InfiniteGrid

class Carrier {
    /**
     * 
     * @param {InfiniteGrid} grid 
     */
    constructor(grid, updateMethod="toggle") {
        this.grid = grid
        this.updateNode = this.grid[updateMethod].bind(this.grid)
        if (!this.updateNode) throw new Error(`Unknown update method '${updateMethod}'`)

        this.x = 0
        this.y = 0

        this.directions = ["N", "E", "S", "W"]
        this.direction = "N"

        this.stats = {
            weakened: 0,
            infected: 0,
            flagged: 0,
            cleaned: 0,
            moved: 0
        }
    }

    turn(offset) {
        const currentIndex = this.directions.indexOf(this.direction)
        this.direction = this.directions[(currentIndex + this.directions.length + offset) % this.directions.length]
    }

    turnLeft() {
        this.turn(-1)
    }

    turnRight() {
        this.turn(1)
    }

    turnAround() {
        this.turn(2)
    }

    move() {
        switch(this.direction) {
            case "N":
                this.y--
                break
            case "E":
                this.x++
                break
            case "S":
                this.y++
                break
            case "W":
                this.x--
                break
            default:
                throw new Error(`Unexpected direction state '${this.direction}'`)
        }
    }

    next() {
        const currentNodeState = this.grid.get(this.x, this.y)
        switch(currentNodeState) {
            case 0:
                this.turnLeft()
                break
            case 1:
                this.turnRight()
                break
            case 2:
                break
            case 3:
                this.turnAround()
                break
        }

        const newState = this.updateNode(this.x, this.y)
        switch(newState) {
            case 0:
                this.stats.cleaned++
                break
            case 1:
                this.stats.infected++
                break
            case 2:
                this.stats.weakened++
                break
            case 3:
                this.stats.flagged++
                break
        }

        this.move()
        this.stats.moved++
        return true
    }
}
exports.Carrier = Carrier