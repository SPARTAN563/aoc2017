const chai = require("chai")
const day14 = require("../day14")

describe("day14", function() {
    this.timeout(10000)
    
    describe("part1", () => {
        describe("buildGrid", () => {
            it("should build the example grid", () => {
                const example = [
                    [1,1,0,1,0,1,0,0],
                    [0,1,0,1,0,1,0,1],
                    [0,0,0,0,1,0,1,0],
                    [1,0,1,0,1,1,0,1],
                    [0,1,1,0,1,0,0,0]
                ]

                const grid = day14.buildGrid("flqrgnkx")
                
                chai.expect(grid).to.have.length(128)
                grid.forEach(row => {
                    chai.expect(row).to.have.length(128)
                })

                example.forEach((eRow, idx) => {
                    chai.expect(grid[idx].slice(0, eRow.length)).to.eql(eRow)
                })
            })
        })

        describe("countUsed", () => {
            it("should return 8108 for the example", () => {
                const grid = day14.buildGrid("flqrgnkx")
                chai.expect(day14.countUsed(grid)).to.eql(8108)
            })
        })
    })

    describe("part2", () => {
        describe("findRegions", () => {
            it("should find 1242 regions in the example", () => {
                const grid = day14.buildGrid("flqrgnkx")
                const regions = day14.findRegions(grid)
                chai.expect(regions).to.have.length(1242)
            })
        })
    })
})