const chai = require("chai")
const fs = require("fs")
const day10 = require("../day10")

describe("day10", () => {
    describe("rotate", () => {
        it("should throw an error if your data is longer than your state", () => {
            chai.expect(() => day10.rotate([0, 1], 0, 5)).to.throw
        })

        it("should return the unmodified list if a length of 0 is provided", () => {
            chai.expect(day10.rotate([0,1,2], 0, 0)).to.eql([0, 1, 2])
        })
        
        it("should return the unmodified list if a length of 1 is provided", () => {
            chai.expect(day10.rotate([0,1,2], 0, 1)).to.eql([0, 1, 2])
        })

        it("should rotate the provided segment of the list with no wraparound", () => {
            chai.expect(day10.rotate([0,1,2],0,2)).to.eql([1,0,2])
        })
        
        it("should rotate the provided segment of the list with wraparound", () => {
            chai.expect(day10.rotate([0,1,2,3,4],3,3)).to.eql([3,1,2,0,4])
        })
    })

    describe("pack", () => {
        it("should correctly pack the example block", () => {
            const example = [65, 27, 9, 1, 4, 3, 40, 50, 91, 7, 6, 0, 2, 5, 68, 22]
            chai.expect(day10.pack(example)).to.eql([64])
        })
    })

    describe("part1", () => {
        describe("example", () => {
            const data = [3, 4, 1, 5]

            it("should build the hash of the sample data correctly", () => {
                let state = new Array(5).fill(0).map((x, i) => i)
                
                chai.expect(day10.round(data, state)).have.property("state").eql([3, 4, 2, 1, 0])
            })
        })
    })

    describe("part2", () => {
        const suffix = [17, 31, 73, 47, 23]
        describe("example", () => {
            const hashes = {
                "": "a2582a3a0e66e6e86e3812dcb672a272",
                "AoC 2017": "33efeb34ea91902bb2f59c9920caa6cd",
                "1,2,3": "3efbe78a8d82f29979031a4aa0b16a9d",
                '1,2,4': "63960835bcdc130f0b66d7ff4f6a5a8e"
            }

            Object.keys(hashes).forEach(str => {
                it(`should calculate the right hash for '${str}'`, () => {
                    chai.expect(day10.hash(str)).to.eql(hashes[str])
                })
            })
        })
    })
})