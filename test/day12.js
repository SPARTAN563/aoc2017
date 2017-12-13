const chai = require("chai")
const day12 = require("../day12")

describe("day12", () => {
    describe("part1", () => {
        it("should split the example into two groups", () => {
            const parser = new day12.Parser("data/day12e.txt")
            chai.expect(parser).to.have.property("lines").with.length.greaterThan(0)
            const groups = day12.group(parser)
            chai.expect(groups).to.have.length(2)
        })

        it("the group with program 0 should contain all except program 1", () => {
            const parser = new day12.Parser("data/day12e.txt")
            chai.expect(parser).to.have.property("lines").with.length.greaterThan(0)
            const groups = day12.group(parser)
            chai.expect(groups).to.have.length(2)
            const g1 = groups.find(x => x.has(0))
            const expected = [0,2,3,4,5,6]
            expected.forEach(x => chai.expect(g1.has(x)).to.be.eql(true, `Expected ${x} to be in the group`))

            chai.expect(g1.has(1)).to.eql(false, `Expected 1 to not be in the group`)
        })
    })

    describe("part2", () => {
        it("should find the total number of groups", () => {
            const parser = new day12.Parser("data/day12e.txt")
            chai.expect(parser).to.have.property("lines").with.length.greaterThan(0)
            const groups = day12.group(parser)
            chai.expect(groups).to.have.length(2)
        })
    })
})