const chai = require("chai")
const checksum = require("../day2")
const fs = require("fs")

describe("day2", () => {
    describe("part1", () => {
        it("should calculate a checksum of 18 for the example", () => {
            const spreadsheet = "5\t1\t9\t5\n7\t5\t3\n2\t4\t6\t8"
            chai.expect(checksum.part1(spreadsheet)).to.eql(18)
        })

        it("should calculate the checksum for the test data", () => {
            const spreadsheet = fs.readFileSync("data/day2.txt", 'utf8')
            console.log(checksum.part1(spreadsheet))
        })
    })

    describe("part2", () => {
        it("should return 9 for the example", () => {
            const spreadsheet = `5\t9\t2\t8\n9\t4\t7\t3\n3\t8\t6\t5`
            chai.expect(checksum.part2(spreadsheet)).to.eql(9)
        })
        
        it("should calculate the checksum for the test data", () => {
            const spreadsheet = fs.readFileSync("data/day2.txt", "utf8")
            console.log(checksum.part2(spreadsheet))
        })
    })
})