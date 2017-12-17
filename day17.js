function SpinlockArray() {
    this.buf = [0]
    this.index = 0
}


/**
 * Performs the next insertion by stepping forward a given number of
 * steps and then inserting the next value after that position.
 * @param {number} steps The number of steps to increment before inserting
 */
SpinlockArray.prototype.next = function(steps) {
    this.index = (this.index + steps) % this.buf.length
    this.buf.splice(this.index + 1, 0, this.buf.length)
    this.index = (this.index + 1) % this.buf.length
}

/**
 * Fetches the maximum value from the buffer
 * @returns {number}
 */
SpinlockArray.prototype.max = function() {
    return this.buf.length - 1
}

/**
 * Retrieves the full circular buffer, starting at the root
 * @returns {Array<number>}
 */
SpinlockArray.prototype.buffer = function() {
    return this.buf
}

/**
 * 
 * @param {number} before The number of preceding entries to fetch
 * @param {number} after The number of following entries to fetch
 * @returns {Array<number>}
 */
SpinlockArray.prototype.slice = function(before, after) {
    const start = (this.index - Math.abs(before) + this.buf.length) % this.buf.length
    const end = (this.index + Math.abs(after) + 1) % this.buf.length

    if (start > end)
        return [].concat(
            this.buf.slice(start),
            this.buf.slice(0, end)
        )

    return this.buf.slice(start, end)
}

/**
 * Gets the value at the provided index (taking the circular buffer into account)
 * @param {number} index 
 * @returns {number}
 */
SpinlockArray.prototype.get = function(index) {
    return this.buf[index % this.buf.length]
}

/**
 * Finds the index of a given entry
 * @param {number} entry 
 */
SpinlockArray.prototype.indexOf = function(entry) {
    if (entry < 0 || entry > this.max()) return -1

    return this.buf.indexOf(entry)
}

/**
 * Fetches the current value
 * @returns {number}
 */
SpinlockArray.prototype.getCurrent = function() {
    return this.buf[this.index]
}

/**
 * Fetches the next value
 * @returns {number}
 */
SpinlockArray.prototype.getNext = function() {
    return this.buf[(this.index + 1) % this.buf.length]
}

/**
 * Fetches the root value
 * @returns {number}
 */
SpinlockArray.prototype.getRoot = function() {
    return this.buf[0]
}

/**
 * Fetches the next value after the root
 * @returns {number}
 */
SpinlockArray.prototype.getRootNext = function() {
    return this.buf[1 % this.buf.length]
}

/**
 * @typedef Node
 * @property {Node} previous
 * @property {Node} next
 * @property {number} value
 */

/**
* Spinlock state machine
* @property {Node} current
* @property {Node} root
*/
function SpinlockLinked() {
    /** @type {Node} */
    const start = {
        previous: null,
        next: null,
        value: 0
    }
    start.previous = start
    start.next = start

    this.root = start
    this.current = start

    this.length = 1
}

/**
 * Performs the next insertion by stepping forward a given number of
 * steps and then inserting the next value after that position.
 * @param {number} steps The number of steps to increment before inserting
 */
SpinlockLinked.prototype.next = function(steps) {
    const actualSteps = steps % this.length

    for (let step = 0; step < actualSteps; step++) {
        this.current = this.current.next
    }

    const next = {
        previous: this.current,
        next: this.current.next,
        value: this.length
    }

    this.current.next.previous = next
    this.current.next = next
    this.current = next
    this.length++
}

/**
 * Fetches the maximum value from the buffer
 * @returns {number}
 */
SpinlockLinked.prototype.max = function() {
    return this.length - 1
}

/**
 * Retrieves the full circular buffer, starting at the root
 * @returns {Array<number>}
 */
SpinlockLinked.prototype.buffer = function() {
    let buffer = new Array(this.length)
    let current = this.root
    for (let i = 0; i < this.length; i++) {
        buffer[i] = current.value
        current = current.next
    }

    return buffer
}

/**
 * 
 * @param {number} before The number of preceding entries to fetch
 * @param {number} after The number of following entries to fetch
 * @returns {Array<number>}
 */
SpinlockLinked.prototype.slice = function(before, after) {
    let current = this.current
    for (let i = 0; i < Math.abs(before); i++)
        current = current.previous

    let slice = []
    for (let i = 0; i < Math.abs(before) + after + 1; i++) {
        slice.push(current.value)
        current = current.next
    }

    return slice
}

/**
 * Gets the value at the provided index (taking the circular buffer into account)
 * @param {number} index 
 * @returns {number}
 */
SpinlockLinked.prototype.get = function(index) {
    index = index % this.length

    let current = this.root
    for(let i = 0; i < index; i++)
        current = current.next

    return current.value
}

/**
 * Finds the index of a given entry
 * @param {number} entry 
 */
SpinlockLinked.prototype.indexOf = function(entry) {
    if (entry < 0 || entry > this.max()) return -1

    let current = this.root
    for(let i = 0;current !== undefined;i++) {
        if (current.value === entry) return i
        current = current.next
    }

    return -1
}

/**
 * Fetches the current value
 * @returns {number}
 */
SpinlockLinked.prototype.getCurrent = function() {
    return this.current.value
}

/**
 * Fetches the next value
 * @returns {number}
 */
SpinlockLinked.prototype.getNext = function() {
    return this.current.next.value
}

/**
 * Fetches the root value
 * @returns {number}
 */
SpinlockLinked.prototype.getRoot = function() {
    return this.root.value
}

/**
 * Fetches the next value after the root
 * @returns {number}
 */
SpinlockLinked.prototype.getRootNext = function() {
    return this.root.next.value
}

/**
 * A predictive spinlock instance which tracks a set of interesting indices
 * @param {Array<number>} indices 
 * @property {Map<number, number>} tracked
 */
function SpinlockPredictive(indices=[0, 1]) {
    this.indices = indices
    this.tracked = {}
    indices.forEach(index => this.tracked[index] = 0)

    this.index = 0
    this.length = 1
}

/**
 * Performs the next insertion by stepping forward a given number of
 * steps and then inserting the next value after that position.
 * @param {number} steps The number of steps to increment before inserting
 */
SpinlockPredictive.prototype.next = function(steps) {
    const targetIndex = (this.index + steps) % this.length

    if (this.tracked.hasOwnProperty(targetIndex + 1))
        this.tracked[targetIndex + 1] = this.length

    this.indices.filter(x => x > targetIndex + 1).forEach(x => this.tracked[x] = undefined)

    this.length++
    this.index = targetIndex + 1
}

/**
 * Fetches the maximum value from the buffer
 * @returns {number}
 */
SpinlockPredictive.prototype.max = function() {
    return this.length - 1
}

/**
 * Retrieves the full circular buffer, starting at the root
 * @returns {Array<number>}
 */
SpinlockPredictive.prototype.buffer = function() {
    throw new Error("Predictive doesn't support this operation")
}

/**
 * 
 * @param {number} before The number of preceding entries to fetch
 * @param {number} after The number of following entries to fetch
 * @returns {Array<number>}
 */
SpinlockPredictive.prototype.slice = function(before, after) {
    throw new Error("Predictive doesn't support this operation")
}

/**
 * Gets the value at the provided index (taking the circular buffer into account)
 * @param {number} index 
 * @returns {number}
 */
SpinlockPredictive.prototype.get = function(index) {
    return this.tracked[index]
}

/**
 * Finds the index of a given entry
 * @param {number} entry 
 */
SpinlockPredictive.prototype.indexOf = function(entry) {
    throw new Error("Predictive does not support this operation")
}

/**
 * Fetches the current value
 * @returns {number}
 */
SpinlockPredictive.prototype.getCurrent = function() {
    return this.length - 1
}

/**
 * Fetches the next value
 * @returns {number}
 */
SpinlockPredictive.prototype.getNext = function() {
    throw new Error("Predictive does not support this operation")
}

/**
 * Fetches the root value
 * @returns {number}
 */
SpinlockPredictive.prototype.getRoot = function() {
    return this.tracked[0]
}

/**
 * Fetches the next value after the root
 * @returns {number}
 */
SpinlockPredictive.prototype.getRootNext = function() {
    return this.tracked[1]
}

exports.SpinlockArray = SpinlockArray
exports.SpinlockLinked = SpinlockLinked
exports.SpinlockPredictive = SpinlockPredictive

exports.Spinlock = SpinlockArray