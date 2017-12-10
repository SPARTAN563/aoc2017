function SM(cell) {
    this.cell = cell

    this.current = 1
    this.x = 0
    this.y = 0
    this.r = 1
    this.direction = "out"

    this.path = []
    this.list = [{ pos: { x: 0, y: 0 }, val: 1}]
}

SM.prototype.tick = function() {
    if (this.current >= this.cell) return false

    if (this.shouldTurn())
        this.turn()

    this.move()
    
    return true
}

SM.prototype.shouldTurn = function() {
    if (this.direction === "out") return true
    const next = this.nextPos()
    if (Math.abs(next.x) > this.r || Math.abs(next.y) > this.r) return true
    return false
}

SM.prototype.turn = function() {
    switch(this.direction) {
        case "right":
            this.direction = "up"
            break
        case "up":
            this.direction = "left"
            break
        case "left":
            this.direction = "down"
            break
        case "down":
            this.direction = "out"
            break
        case "out":
            this.direction = "right"
            break
    }
}

SM.prototype.move = function() {
    if (this.direction === "out") {
        this.r++
        return
    }

    const next = this.nextPos()
    
    this.x = next.x
    this.y = next.y
    this.current = this.list.filter(x => Math.abs(this.x - x.pos.x) <= 1 && Math.abs(this.y - x.pos.y) <= 1).reduce((sum, x) => sum + x.val, 0)
    
    this.list.push({pos: next, val: this.current})
    this.path.push(`${this.direction} (${this.x}, ${this.y}, ${this.current})`)
}

SM.prototype.nextPos = function() {
    switch(this.direction) {
        case "right":
            return { x: this.x - 1, y: this.y }
        break
        case "up":
        return { x: this.x, y: this.y - 1 }
        break
        case "left":
        return { x: this.x + 1, y: this.y }
        break
        case "down":
        return { x: this.x, y: this.y + 1 }
        break
    }
}

module.exports = function distance(cell) {
    // 1
    // 8
    // 16
    // 24

    const sm = new SM(cell)
    while(sm.tick());
    //console.log(`Current: ${sm.current} (${sm.path.join("->")})`)
    return sm.current
}