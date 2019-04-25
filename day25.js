class Tape {
    constructor(initialSpan=0) {
        this.cursor = 0
        this.positiveSpan = new Array(initialSpan)
        this.negativeSpan = new Array(initialSpan)
    }

    moveLeft() {
        this.cursor--
    }

    moveRight() {
        this.cursor++
    }

    /**
     * @returns {number}
    */
    current() {
        if(this.cursor >= 0)
            return this.positiveSpan[this.cursor] || 0
        else
            return this.negativeSpan[-this.cursor] || 0
    }

    /**
     * 
     * @param {number} value 
     */
    write(value) {
        if(this.cursor >= 0)
            this.positiveSpan[this.cursor] = value
        else
            this.negativeSpan[-this.cursor] = value
    }

    /**
     * @returns {IterableIterator<number>}
     */
    *values() {
        for (let i = this.negativeSpan.length -1; i > 0; i--)
            yield this.negativeSpan[i]

        for (let i = 0; i < this.positiveSpan.length; i++)
            yield this.positiveSpan[i]
    }
}
exports.Tape = Tape

class Condition {
    /**
     * 
     * @param {(current: number) => boolean} evaluate 
     * @param {(machine: TuringMachine) => void} actions 
     */
    constructor(evaluate, execute) {
        this.test = evaluate
        this.execute = execute
    }
}
exports.Condition = Condition

class State {
    /**
     * 
     * @param {string} name 
     * @param {Array<Condition>} conditions 
     */
    constructor(name, ...conditions) {
        this.name = name
        this.conditions = conditions
    }
}
exports.State = State

class TuringMachine {
    /**
     * 
     * @param {State} startingState
     * @param {Array<State>} states 
     */
    constructor(startingState, ...states) {
        this.states = {
            [startingState.name]: startingState
        }
        this.tape = new Tape()

        states.forEach(s => this.states[s.name] = s)

        /**
         * @type {State}
         */
        this.current = startingState
        this.steps = 0
    }

    /**
     * Resets the tape used by this Turing Machine
     * @param {number} initialSpan 
     */
    resetTape(initialSpan=0) {
        this.tape = new Tape(initialSpan)
    }

    changeState(name) {
        if (!this.states.hasOwnProperty(name)) throw new Error(`Unknown state '${name}'`)
        this.current = this.states[name]
    }

    checksum() {
        let sum = 0
        for (const n of this.tape.values())
            sum += !!n ? 1 : 0

        return sum
    }

    next() {
        const currentNumber = this.tape.current()
        const matchedConditions = this.current.conditions.filter(c => c.test(currentNumber))
        matchedConditions.forEach(c => c.execute(this))
        this.steps++

        return true
    }
}
exports.TuringMachine = TuringMachine

/**
 * 
 * @param {string} startIn 
 * @param {Object} stateSpecs { "A": { "0": { move: "Left", write: 0, next: "B" }, ... }}
 */
exports.buildMachine = function(startIn, stateSpecs) {
    const states = {}
    
    Object.keys(stateSpecs).forEach(stateName => {
        const spec = stateSpecs[stateName]
        const conditions = Object.keys(spec).map(valueString => {
            const value = parseFloat(valueString)
            const condSpec = spec[valueString]
            const condition = new Condition(x => x === value, m => {
                m.tape.write(condSpec.write)
                m.tape[`move${condSpec.move}`]()
                m.changeState(condSpec.next)
            })

            return condition
        })

        const state = new State(stateName, ...conditions)
        states[stateName] = state
    })

    return new TuringMachine(states[startIn], ...Object.keys(states).filter(x => x !== startIn).map(x => states[x]))
}