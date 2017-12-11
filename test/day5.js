const chai = require("chai")
const exitVelocity = require("../day5")
const fs = require("fs")

describe("day5", () => {
    describe("part1", () => {
        it("should return 5 for the example", () => {
            const list = [
                0,
                3,
                0,
                1,
                -3
            ]

            chai.expect(exitVelocity(list)).to.eql(5)
        })
    })

    describe("part2", () => {
        const mutator = x => x >= 3 ? x - 1 : x + 1
        it("should return 5 for the example", () => {
            const list = [
                0,
                3,
                0,
                1,
                -3
            ]

            chai.expect(exitVelocity(list, mutator)).to.eql(10)
        })
    })
})