class State {
    /**
     * 
     * @param {Object} initialState 
     */
    constructor(initialState={}) {
        this.ic = 0

        this.registers = {}
        Object.keys(initialState).forEach(register => this.registers[register] = initialState[register])
    }

    /**
     * sets register X to the value of Y
     * @param {string} register 
     * @param {string|number} value 
     */
    set(register, value) {
        if (typeof value === "string") value = (this.registers[value] || 0)
        this.registers[register] = value
        this.ic++
        return true
    }

    /**
     * increases register X by the value of Y.
     * @param {string} register 
     * @param {string|number} value 
     */
    add(register, value) {
        if (typeof value === "string") value = (this.registers[value] || 0)
        this.registers[register] = (this.registers[register] || 0) + value
        this.ic++
        return true
    }

    /**
     * increases register X by the value of Y.
     * @param {string} register 
     * @param {string|number} value 
     */
    sub(register, value) {
        if (typeof value === "string") value = (this.registers[value] || 0)
        this.registers[register] = (this.registers[register] || 0) - value
        this.ic++
        return true
    }

    /**
     * sets register X to the result of multiplying the value contained in register X by the value of Y.
     * @param {string} register 
     * @param {string|number} value 
     */
    mul(register, value) {
        if (typeof value === "string") value = (this.registers[value] || 0)
        this.registers[register] = (this.registers[register] || 0) * value
        this.ic++
        return true
    }

    /**
     * jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
     * @param {string|number} test 
     * @param {string|number} value 
     */
    jnz(test, value) {
        if (typeof test === "string") test = (this.registers[test] || 0)
        if (typeof value === "string") value = (this.registers[value] || 0)
        if (test !== 0) {
            this.ic += value
            return true
        }
        else {
            this.ic++
            return false
        }
    }

    toJSON() {
        return {
            registers: this.registers,
            played: this.played
        }
    }
}

class Interpreter {
    /**
     * 
     * @param {Array<string>} instructions
     * @param {Object} initialState
     */
    constructor(instructions, initialState={}) {
        this.instructions = instructions
        this.state = new State(initialState)
    }

    next() {
        const instruction = this.instructions[this.state.ic]
        if (!instruction) return false

        const parts = instruction.split(" ")
        const type = parts[0]
        const args = parts.slice(1).map(arg => {
            if (/^-?\d+/.test(arg)) return parseInt(arg)
            return arg
        })

        const fn = this.state[type]
        if (!fn) throw new Error(`Unknown instruction type '${type}' used`)

        const result = fn.apply(this.state, args)

        return {
            instruction,
            type,
            args,
            result,
            ic: this.state.ic,
            registers: this.state.registers
        }
    }
}
exports.Interpreter = Interpreter

/**
 * Finds composite numbers between the lower and upper bounds and returns
 * the number of composites found
 * @param {number} lowerBound The number to start searching for composites from
 * @param {number} upperBound The number to stop searching for composites at
 * @param {number} increment The incrementing number between each test
 * @returns {number} The number of composite numbers located in the range
 * @see data/day23optimized.txt
 */
exports.findCompositeNumbers = function findCompositeNumbers(lowerBound, upperBound, increment) {
    if (lowerBound > upperBound) throw new Error("Upper bound should be greater than or equal to the lower bound")
    if ((upperBound - lowerBound) % increment) throw new Error("Upper bound should be a multiple of 'increment' away from the lower bound")

    let numberOfPrimes = 0
    // For each number between b and c, in increments of 17...
    for (let x = lowerBound; x <= upperBound; x += increment) {
        // Initialize our "found a factor" register to true
        let isNormalFactor = true

        // Can be re-written much more succinctly by testing
        // the lower half of the range using modulo
        for(let factor = 2; factor**2 < x; factor++) {
            if (!(x % factor)) {
                isNormalFactor = false
                break // No need to keep checking after we find a factor
            }
        }
        
        // If we find a factor, increment our counter
        if (!isNormalFactor) {
            numberOfPrimes++
        }
    }
    return numberOfPrimes
}