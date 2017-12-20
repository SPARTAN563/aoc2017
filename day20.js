class Vector {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    /**
     * @returns {number}
     */
    get magnitude() {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2)
    }

    /**
     * @returns {number}
     */
    get manhattanMagnitude() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
    }

    /**
     * @returns {boolean}
     */
    get zero() {
        return this.x === 0 && this.y === 0 && this.z === 0
    }

    /**
     * Finds the vector between this vector and another target vector
     * @param {Vector} target 
     * @returns {Vector}
     */
    to(target) {
        return new Vector(target.x - this.x, target.y - this.y, target.z - this.z)
    }

    /**
     * Finds the Euclidean distance between this vector and another
     * @param {Vector} from 
     * @returns {number}
     */
    distance(from) {
        return this.to(from).magnitude
    }

    /**
     * Finds the manhattan distance between this vector and another
     * @param {Vector} from 
     * @returns {number}
     */
    manhattanDistance(from) {
        return this.to(from).manhattanMagnitude
    }

    /**
     * Adds another vector to this one and returns a new vector representing the result
     * @param {Vector} v 
     * @returns {Vector}
     */
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    /**
     * Scales the magnitude of this vector by a given factor
     * @param {number} f 
     * @returns {Vector}
     */
    scale(f) {
        return new Vector(this.x * f, this.y * f, this.z * f)
    }

    /**
     * Determines whether two vectors are equal to one another
     * @param {Vector} v 
     */
    equal(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z
    }

    toString() {
        return `<${this.x},${this.y},${this.z}>`
    }
}
exports.Vector = Vector

/**
 * Computes the quadratic roots of a function
 * @param {number} a the X^2 constant
 * @param {number} b the X constant
 * @param {number} c the constant
 * @returns {Array<number>}
 */
function quadRoots(a, b, c) {
    if (!a && !b && !c) return undefined
    if (!a && !b) return []
    if (!a) return [-c / b]

    if (4 * a * c > b**2) return []
    const sqrt = Math.sqrt(b**2 - 4*a*c)
    return [...new Set([(-b+sqrt)/(2*a), (-b-sqrt)/(2*a)]).values()]
}
exports.quadRoots = quadRoots

class Particle {

    /**
     * Creates a new particle
     * @param {Vector} p The current position of the particle
     * @param {Vector} v The current velocity of the particle
     * @param {Vector} a The acceleration of the particle
     */
    constructor(id, p, v, a) {
        this.id = id
        this.p = p
        this.v = v
        this.a = a
    }

    /**
     * Moves the particle's simulation forward a given number
     * of steps (defaults to 1).
     * @param {number} steps 
     */
    next(steps=1) {
        this.p = this.positionAfter(steps)
        this.v = this.velocityAfter(steps)
    }

    /**
     * Calculates the velocity for this particle after a certain
     * number of steps have elapsed, without changing the particle
     * @param {number} steps 
     * @returns {Vector}
     */
    velocityAfter(steps=1) {
        return new Vector(
            this.v.x + steps * this.a.x,
            this.v.y + steps * this.a.y,
            this.v.z + steps * this.a.z,
        )
    }

    /**
     * Calculates the position of this particle after a certain number of steps
     * have elapsed, without moving the particle
     * @param {number} steps 
     * @returns {Vector}
     */
    positionAfter(steps=1) {
        return new Vector(
            this.p.x + steps * (this.v.x + 0.5*this.a.x) + steps**2 * (0.5*this.a.x),
            this.p.y + steps * (this.v.y + 0.5*this.a.y) + steps**2 * (0.5*this.a.y),
            this.p.z + steps * (this.v.z + 0.5*this.a.z) + steps**2 * (0.5*this.a.z)
        )
    }

    /**
     * Determines whether this particle collides with another
     * @param {Particle} other
     * @returns {Array<number>}
     */
    collides(other) {
        if (this.p.equal(other.p)) return [0]

        /*
         * Acceleration contributes SUM(a*n, term='n', from='0', to=step)
         * to the final position.
         * This can be expressed as:
         *  a/2 * n (n + 1)
         * 
         * Therefore the final position of a given particle is:
         * p = p0 + n(v + a/2) + n^2(a/2)
         * 
         * We can solve for the quadratic roots of this equation by setting
         * one particle equal to another. This can also be expressed as finding
         * the point at which the difference vector between P1 and P2 is zero.
         * 
         * If we find a root which is a positive  integer, then it is a valid step.
         * 
         * Finally, we just need to compare those valid roots on each axis to
         * ensure that we have a valid collision.
         */

        const dA = other.a.to(this.a)
        const dV = other.v.to(this.v)
        const dP = other.p.to(this.p)

        // console.debug(`dP: ${dP}`)
        // console.debug(`dV: ${dV}`)
        // console.debug(`dA: ${dA}`)

        const xR = quadRoots(dA.x, 2*dV.x+dA.x, 2*dP.x)
        const yR = quadRoots(dA.y, 2*dV.y+dA.y, 2*dP.y)
        const zR = quadRoots(dA.z, 2*dV.z+dA.z, 2*dP.z)
        // console.debug(`xR: ${xR}`)
        // console.debug(`yR: ${yR}`)
        // console.debug(`zR: ${zR}`)
        
        const candidateRoots = []
        if (xR !== undefined) candidateRoots.push(...xR)
        if (yR !== undefined) candidateRoots.push(...yR)
        if (zR !== undefined) candidateRoots.push(...zR)
        //console.debug(`rC: ${candidateRoots}`)

        const roots = new Set(candidateRoots.filter(root => (xR === undefined || ~xR.indexOf(root)) && (yR === undefined || ~yR.indexOf(root)) && (zR === undefined || ~zR.indexOf(root))))
        //console.debug(`rF: ${[...roots.values()]}`)

        return [...roots.values()]
    }

    toString() {
        return `p=${this.p}, v=${this.v}, a=${this.a}`
    }
}
exports.Particle = Particle

class ParticleField {
    /**
     * 
     * @param {Array<Particle>} particles 
     */
    constructor(...particles) {
        /** @type {Array<Particle>} */
        this.particles = particles
    }

    /**
     * Runs the particle field simulation for the given number of steps
     * @param {number} steps 
     */
    next(steps=1) {
        this.particles.forEach(p => p.next(steps))
    }

    /**
     * Identifies the particles which are currently colliding
     * @returns {Array<Particle>}
     */
    findCollisions() {
        const positions = {}
        this.particles.forEach(p => {
            positions[p.p.toString()] = (positions[p.p.toString()] || [])
            positions[p.p.toString()].push(p)
        })

        return this.particles.filter(p => positions[p.p.toString()].length > 1)
    }

    /**
     * Identifies the next step which will result in particles colliding
     * @returns {number}
     */
    findCollisionSteps() {
        let collisions = new Set()
        let tested = new Set()
        this.particles.forEach(p => {
            this.particles.filter(x => x.id !== p.id).forEach(x => {
                if (tested.has(`${p.id}:${x.id}`)) return
                tested.add(`${p.id}:${x.id}`)

                const collisionRoots = x.collides(p)
                if (collisionRoots.length)
                    collisionRoots.forEach(root => collisions.add(root))
            })
        })

        const collisionRoots = [...collisions.values()]
        // console.log(`Roots: ${collisionRoots}`)
        const validCollisionRoots = collisionRoots.filter(x => x >= 0 && Math.floor(x) === x)
        
        if (!validCollisionRoots.length) return false

        return validCollisionRoots.sort((a,b) => a > b ? 1 : -1)
    }

    /**
     * Removes a list of particles from this field
     * @param {Array<Particle>} particles 
     */
    remove(...particles) {
        this.particles = this.particles.filter(p => !particles.some(x => x.id === p.id))
    }

    /**
     * Finds the vector that is nearest to a given point
     * @param {Vector} point 
     */
    nearest(point) {
        return this.particles.slice().sort((a, b) => a.p.manhattanDistance(point) > b.p.manhattanDistance(point) ? 1 : -1).find(x => true)
    }
}
exports.ParticleField = ParticleField

class Parser {
    /**
     * 
     * @param {string} s 
     * @returns {Vector}
     */
    parseVector(s) {
        const axes = s.replace(/[<> ]/g, "").split(",").map(parseFloat)
        if (axes.length !== 3) throw new Error(`Cannot parse vector '${s}': not a valid vector format`)
        return new Vector(axes[0], axes[1], axes[2])
    }

    /**
     * 
     * @param {number} id
     * @param {string} s 
     * @returns Particle
     */
    parseParticle(id, s) {
        const components = s.split(", ")
        if (components.length !== 3) throw new Error(`Cannot parse particle '${s}': not a valid particle format`)
        let p = new Vector(0, 0, 0), v = new Vector(0, 0, 0), a = new Vector(0, 0, 0)
        components.forEach(component => {
            const parts = component.split("=")
            if (parts.length !== 2) throw new Error(`Cannot part particle '${s}': not a valid particle format`)
            const vector = this.parseVector(parts[1])
            switch(parts[0]) {
                case "p":
                    p = vector
                    break
                case "v":
                    v = vector
                    break
                case "a":
                    a = vector
                    break
                default:
                    throw new Error(`Unknown particle property '${parts[0]}' for particle '${s}'`)
            }
        })

        return new Particle(id, p, v, a)
    }

    /**
     * Parses a list of particles
     * @param {string} s 
     * @returns {ParticleField}
     */
    parseParticleField(s) {
        return new ParticleField(...s.split("\n").map(x => x.trim()).filter(x => !!x).map((x, i) => this.parseParticle(i, x)))
    }
}
exports.Parser = Parser