const day10 = require("./day10")

function toBitMap(byte) {
    const bits = []
    for(let j = 7; j >= 0; j--)
        bits.push((byte >> j) & 0x1)

    return bits
}

function buildGrid(puzzleKey) {
    const rowData = new Array(128).fill(0).map((_, i) => day10.hash(`${puzzleKey}-${i}`))
    return rowData.map(row => {
        const buf = Buffer.from(row, "hex")
        let results = []
        buf.forEach(byte => results = results.concat(toBitMap(byte)))
        return results
    })
}

exports.buildGrid = buildGrid

function countUsed(grid) {
    return grid.reduce((used,row) => {
        return row.filter(x => x === 1).length + used
    }, 0)
}
exports.countUsed = countUsed

/**
 * @typedef Cell
 * @prop {number} x
 * @prop {number} y
 */

/**
 * Region manages adjacent regions
 */
function Region() {
    /** @type {Array<Cell>} */
    this.cells = []
}

/**
 * Determines whether a cell is adjacent to a region or not
 * @param {number} x
 * @param {number} y
 */
Region.prototype.isAdjacent = function(x, y) {
    return this.cells.some(cell => 
        (cell.x === x && Math.abs(cell.y - y) === 1)
        ||
        (cell.y === y && Math.abs(cell.x - x) === 1))
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 */
Region.prototype.add = function(x, y) {
    this.cells.push({ x,  y})
}

/**
 * @param {Region} region
 */
Region.prototype.merge = function(region) {
    region.cells.forEach(cell => this.add(cell.x, cell.y))
}

/**
 * @param {Array<Array<number>>} grid
 */
function findRegions(grid) {
    /** @type {Array<Region>} */
    let regions = []

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (!cell) return // Skip over unused blocks
            const adjacentRegions = regions.filter(r => r.isAdjacent(x, y))
            if (!adjacentRegions.length) {
                const region = new Region()
                region.add(x, y)
                regions.push(region)
            } else if (adjacentRegions.length === 1) {
                adjacentRegions[0].add(x, y)
            } else {
                const rootRegion = adjacentRegions[0]
                rootRegion.add(x, y)

                const mergedRegions = adjacentRegions.slice(1)
                mergedRegions.forEach(region => rootRegion.merge(region))
                regions = regions.filter(r => !~mergedRegions.indexOf(r))
            }
        })
    })

    return regions
}
exports.findRegions = findRegions