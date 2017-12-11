function HexVector(x=0, y=0) {
    this.x = x
    this.y = y
}

HexVector.prototype.add = function(direction) {
    switch(direction) {
        case "n":
            return new HexVector(this.x, this.y + 1)
        case "s":
            return new HexVector(this.x, this.y - 1)
        case "ne":
            return new HexVector(this.x + 0.5, this.y + 0.5)
        case "se":
            return new HexVector(this.x + 0.5, this.y - 0.5)
        case "nw":
            return new HexVector(this.x - 0.5, this.y + 0.5)
        case "sw":
            return new HexVector(this.x - 0.5, this.y - 0.5)
    }
}

HexVector.prototype.path = function() {
    const path = []
    let x = this.x
    let y = this.y

    for (;Math.abs(x) > 0; x > 0 ? x-=0.5 : x+=0.5) {
        path.push(`${y >= 0 ? "n" : "s"}${x >= 0 ? "e": "w"}`)
        y >= 0 ? y-=0.5 : y+=0.5
    }

    for(;Math.abs(y) > 0; y > 0 ? y-- : y++)
        path.push(`${y >= 0 ? "n" : "s"}`)

    return path.sort()
}

function steps(path) {
    const vector = path.reduce((vector, dir) => vector.add(dir), new HexVector())

    return vector.path()
}
exports.steps = steps

function maxDistance(path) {
    const ctx = path.reduce((ctx, dir) => {
        const newVector = ctx.vector.add(dir)
        const newVectorPath = newVector.path()
        if (newVectorPath.length > ctx.maxDist)
            return { vector: newVector, maxDist: newVectorPath.length }
        else
            return { vector: newVector, maxDist: ctx.maxDist }
    }, { vector: new HexVector(), maxDist: 0 })

    return ctx.maxDist
}
exports.maxDistance = maxDistance