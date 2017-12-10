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

        it("should calculate the result", () => {
            const list = fs.readFileSync("data/day5.txt", "utf8").split("\n").map(x => x.trim()).map(parseFloat)
            console.log(`Exit in ${exitVelocity(list)} steps`)
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

        it("should calculate the result", () => {
            const list = fs.readFileSync("data/day5.txt", "utf8").split("\n").map(x => x.trim()).map(parseFloat)
            console.log(`Exit in ${exitVelocity(list, mutator)} steps`)
        })
    })
})