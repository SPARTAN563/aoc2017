const chai = require("chai")

describe("day3", () => {
    describe("part1", () => {
        const distance = require("../day3p1")
        it("should return 0 for cell 1", () => {
            chai.expect(distance(1)).to.eql(0)
        })

        it("should return 1 for cell 8", () => {
            chai.expect(distance(8)).to.eql(1)
        })

        it("should return 3 for cell 12", () => {
            chai.expect(distance(12)).to.eql(3)
        })
        
        it("should return 2 for cell 23", () => {
            chai.expect(distance(23)).to.eql(2)
        })

        it("should return 31 for cell 1024", () => {
            chai.expect(distance(1024)).to.eql(31)
        })
    })

    describe("part2", () => {
        const firstGreater = require("../day3p2")
        it("should return 4 for value 3", () => {
            chai.expect(firstGreater(3)).to.eql(4)
        })

        it("should return 304 for value 180", () => {
            chai.expect(firstGreater(180)).to.eql(304)
        })
    })
})