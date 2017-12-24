class Component {
    /**
     * 
     * @param {Array<number>} ports 
     */
    constructor(...ports) {
        this.ports = ports.sort((a, b) => a > b ? 1 : -1)
    }

    /**
     * Calculates the total value of this component
     * @returns {number}
     */
    get value() {
        return this.ports.reduce((sum, p) => sum + p)
    }

    /**
     * Determines whether this component can connect to another
     * @param {Component} component 
     * @returns {boolean}
     */
    canConnectTo(component) {
        return this.ports.some(p => component.ports.includes(p))
    }

    /**
     * Returns a new component which describes this one with a
     * connection to the given port
     * @param {number} port 
     * @returns {Component}
     */
    withConnection(port) {
        const i = this.ports.indexOf(port)
        if (!~i) throw new Error(`Port ${port} does not exist on this component`)

        return new Component(...this.ports.filter((_, ii) => ii !== i))
    }

    toString() {
        return this.ports.join("/")
    }
}
exports.Component = Component

class Bridge {
    /**
     * 
     * @param {Array<Component>} components The components (in order) that form this bridge
     */
    constructor(...components) {
        this.components = components || []

        this.root = new Component(0)
        this.leaf = this.root
        components.forEach(component => {
            if (!component.canConnectTo(this.leaf)) throw new Error(`Cannot build bridge, component ${component} cannot connect to current bridge end node: ${this.leaf}`)
            const newLeaf = component.withConnection(this.leaf.ports[0])
            this.leaf = newLeaf
        })
    }

    get value() {
        return this.components.reduce((sum, c) => sum + c.value, 0)
    }

    get length() {
        return this.components.length
    }

    toString() {
        return this.components.join("--")
    }
}
exports.Bridge = Bridge

class Builder {
    /**
     * 
     * @param {Array<Component>} components 
     */
    constructor(...components) {
        this.components = components
    }

    /**
     * 
     * @param {Bridge} from 
     * @returns {Iterator<Bridge>}
     */
    *build(from=new Bridge()) {
        const availableComponents = this.components.filter(x => !from.components.includes(x))

        for (const component of availableComponents) {
            if (!from.leaf.canConnectTo(component)) continue
            const bridge = new Bridge(...from.components, component)
            yield bridge
            yield* this.build(bridge)
        }
    }

    /**
     * 
     * @param {Bridge} from 
     * @returns {Bridge}
     */
    strongest(from=new Bridge()) {
        /** @type {Bridge} */
        let best = null
        for(const bridge of this.build(from)) {
            if (!best || best.value < bridge.value) best = bridge
        }

        return best
    }

    /**
     * 
     * @param {Bridge} from 
     * @returns {Bridge}
     */
    longest(from=new Bridge()) {
        /** @type {Bridge} */
        let best = null
        for(const bridge of this.build(from)) {
            if (!best) best = bridge
            else if (bridge.length > best.length) best = bridge
            else if (bridge.length === best.length && bridge.value > best.value) best = bridge
        }

        return best
    }
}
exports.Builder = Builder

class Parser {
    /**
     * 
     * @param {string} componentType A component type like "1" or "12"
     * @returns {number}
     */
    parseComponentType(componentType) {
        return parseFloat(componentType)
    }

    /**
     * 
     * @param {string} component A component like "1/0" or "7/2"
     * @returns {Component}
     */
    parseComponent(component) {
        const parts = component.split("/")
        if (parts.length !== 2) throw new Error(`'${component}' is not a valid component spec`)

        return new Component(...parts.map(x => this.parseComponentType(x)))
    }
}
exports.Parser = Parser