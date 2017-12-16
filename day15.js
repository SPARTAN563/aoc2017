/**
 * A generator generates a sequence of values based
 * on a given factor and divisor
 * @param {number} seed The number that seeds the generator
 * @param {number} factor 
 * @param {number} divisor 
 */
function Generator(seed, factor, divisor=2147483647) {
    this.seed = seed

    this.factor = factor
    this.divisor = divisor
}

/**
 * @returns {number}
 */
Generator.prototype.next = function() {
    return this.seed = (this.seed * this.factor) % this.divisor
}

/**
 * @param {number} seed The new seed to use for this generator
 */
Generator.prototype.reseed = function(seed) {
    this.seed = seed
}

exports.Generator = Generator

/**
 * @param {Generator} generator
 * @param {(x: number) => boolean} predicate
 */
function Filter(generator, predicate) {
    this.generator = generator
    this.predicate = predicate
}

/**
 * @returns {number}
 */
Filter.prototype.next = function() {
    for(;;) {
        const sample = this.generator.next()
        if (this.predicate(sample)) return sample
    }
}
exports.Filter = Filter

/**
 * 
 * @param {Array<Generator|Filter>} generators 
 */
function Judge(...generators) {
    this.generators = generators
}

/**
 * @param {number} mask
 * @returns {boolean}
 */
Judge.prototype.sample = function(mask=0xffff) {
    if (this.generators.length === 1)
        return true

    if(this.generators.length === 2)
        return (this.generators[0].next() & mask) === (this.generators[1].next() & mask)

    // Support more generators (at a performance cost)
    const set = new Set()
    return this.generators.some(gen => {
        const sample = gen.next()
        if (set.has(sample & mask)) return true
        set.add(sample & mask)
        return false
    })
}

/**
 * 
 * @param {number} sampleCount 
 * @param {number} mask 
 * @returns {number}
 */
Judge.prototype.multiSample = function(sampleCount, mask=0xffff) {
    let matches = 0
    for(let i = 0; i < sampleCount; i++)
        if(this.sample(mask)) matches++

    return matches
}
exports.Judge = Judge