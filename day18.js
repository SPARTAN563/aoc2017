/**
 * @typedef HubMessage
 * @property {HubClient} client
 * @property {number} value
 */

/**
 * 
 */
class Hub {
    constructor() {
        /** @type {Array<HubClient>} */
        this.clients = []
    }

    /**
     * Publishes a value to clients connected to this hub
     * @param {HubClient} client 
     * @param {number} value 
     */
    publish(client, value) {
        this.clients.filter(c => c !== client).forEach(c => c.queue.push({
            client,
            value
        }))
    }

    /**
     * Creates a new HubClient which is subscribed to this Hub
     * @returns {HubClient}
     */
    subscribe() {
        const client = new HubClient(this)
        this.clients.push(client)
        return client
    }
}
exports.Hub = Hub

class HubClient {
    /**
     * @param {Hub} hub
     */
    constructor(hub) {
        /**
         * @type {Array<HubMessage>}
         */
        this.queue = []
        this.hub = hub
    }

    /**
     * Publishes a value to the hub
     * @param {number} value 
     */
    send(value) {
        this.hub.publish(this, value)
    }

    /**
     * @returns {HubMessage}
     */
    receive() {
        return this.queue.shift()
    }
}

class LoopbackHub extends Hub {
    /**
     * Publishes a value to clients connected to this hub
     * @param {HubClient} client 
     * @param {number} value 
     */
    publish(client, value) {
        this.clients.filter(c => c === client).forEach(c => c.queue.push({
            client,
            value
        }))
    }

    subscribe() {
        const client = new LoopbackHubClient(this)
        this.clients.push(client)
        return client
    }
}
exports.LoopbackHub = LoopbackHub

class LoopbackHubClient extends HubClient {
    receive() {
        return this.queue.shift() || {
            client: this,
            value: 0
        }
    }
}

class State {
    /**
     * 
     * @param {HubClient} hub 
     * @param {Object} initialState 
     */
    constructor(hub, initialState={}) {
        this.hub = hub

        this.ic = 0

        this.registers = {}
        Object.keys(initialState).forEach(register => this.registers[register] = initialState[register])
    }


    /**
     * plays a sound with a frequency equal to the value of X.
     * @param {string|string} register 
     */
    snd(value) {
        if (typeof value === "string") value = (this.registers[value] || 0)
        this.hub.send(value)
        this.ic++
        return true
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
     * sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
     * @param {string} register 
     * @param {string|number} value 
     */
    mod(register, value) {
        if (typeof value === "string") value = (this.registers[value] || 0)
        this.registers[register] = (this.registers[register] || 0) % value
        this.ic++
        return true
    }

    /**
     * recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
     * @param {string} register 
     */
    rcv(register) {
        if (this.registers.safeReceive && !this.registers[register]) {
            this.ic++
            return false
        }

        const received = this.hub.receive()
        if (received === undefined) return false

        this.registers[register] = received.value
        this.ic++
        return true
    }

    /**
     * jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
     * @param {string|number} test 
     * @param {string|number} value 
     */
    jgz(test, value) {
        if (typeof test === "string") test = (this.registers[test] || 0)
        if (typeof value === "string") value = (this.registers[value] || 0)
        if (test > 0) {
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
     * @param {HubClient} hub
     * @param {Object} initialState
     */
    constructor(instructions, hub, initialState={}) {
        this.instructions = instructions
        this.state = new State(hub, initialState)
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

class ParallelExecutor {
    /**
     * 
     * @param {Array<Interpreter>} interpreters 
     */
    constructor(...interpreters) {
        this.interpreters = interpreters
    }

    next() {
        const originalICs = this.interpreters.map(int => int.state.ic)
        const results = this.interpreters.map(int => int.next())
        const newICs = results.map(res => res.ic)

        if (originalICs.every((ic, i) => newICs[i] === ic))
            return false

        return {
            results
        }
    }
}
exports.ParallelExecutor = ParallelExecutor