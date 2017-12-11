const chai = require("chai");
const SM = require("../day6");
const fs = require("fs");

describe("day6", () => {
    describe("part1", () => {
        describe("example", () => {
            const blocks = [0,2,7,0]
            const sm = new SM(blocks)

            it("should rebalance the 3rd block first", () => {
                sm.rebalance()
                chai.expect(sm.blocks).to.eql([2, 4, 1, 2])
            })

            it("should rebalance the 2nd block next", () => {
                chai.expect(sm.blocks).to.eql([2, 4, 1, 2])
                sm.rebalance()
                chai.expect(sm.blocks).to.eql([3, 1, 2, 3])
            })
            
            it("should rebalance with a draw correctly", () => {
                chai.expect(sm.blocks).to.eql([3, 1, 2, 3])
                sm.rebalance()
                chai.expect(sm.blocks).to.eql([0, 2, 3, 4])
            })
            
            it("should the fourth block correctly", () => {
                chai.expect(sm.blocks).to.eql([0, 2, 3, 4])
                sm.rebalance()
                chai.expect(sm.blocks).to.eql([1, 3, 4, 1])
            })

            it("should find the same state after 5 attempts", () => {
                const sm = new SM(blocks)
                const stateSet = new Set()

                let cycles = 0;
                while(!stateSet.has(JSON.stringify(sm.blocks))) {
                    stateSet.add(JSON.stringify(sm.blocks))
                    sm.rebalance()
                    cycles++
                }

                chai.expect(cycles).to.eql(5)
            })
        })
    })

    describe("part2", () => {
        it("should have a loop length of 4 for the example", () => {
            const blocks = [0,2,7,0]
            const sm = new SM(blocks)
            const stateSet = {}

            let cycles = 0;
            while(stateSet[JSON.stringify(sm.blocks)] === undefined) {
                stateSet[JSON.stringify(sm.blocks)] = cycles
                sm.rebalance()
                cycles++
            }

            const length = cycles - stateSet[JSON.stringify(sm.blocks)]
            chai.expect(length).to.eql(4)
        })
    })
})