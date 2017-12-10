function SM(list, mutator) {
    this.list = list
    this.mutator = mutator

    this.offset = 0
    this.steps = 0
}

SM.prototype.next = function() {
    const jump = this.list[this.offset]
    if (jump === undefined) return false

    this.list[this.offset] = this.mutator(this.list[this.offset])
    this.offset += jump
    this.steps++
    return true
}

SM.prototype.toString = function() {
    return this.list.map((x, i) => i === this.offset ? `(${x})` : `${x}`).join(" ")
}

module.exports = function exitVelocity(instructions, mutator) {
    mutator = mutator || function(i) { return i + 1 }

    const sm = new SM(instructions, mutator)
    //console.log(sm.toString()
    while(sm.next());
        //console.log(sm.toString())
    return sm.steps
}