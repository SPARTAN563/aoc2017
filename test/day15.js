const chai = require("chai")
const day15 = require("../day15")

describe("day15", function() {
    this.timeout(10000)
    
    describe("part1", () => {
        describe("generator A", () => {
            const genA = new day15.Generator(65, 16807)
            it("should generate the first sequence correctly", () => {
                chai.expect(genA.next()).to.eql(1092455)
                chai.expect(genA.next()).to.eql(1181022009)
                chai.expect(genA.next()).to.eql(245556042)
                chai.expect(genA.next()).to.eql(1744312007)
                chai.expect(genA.next()).to.eql(1352636452)
            })
        })

        describe("generator B", () => {
            const genA = new day15.Generator(8921, 48271)
            it("should generate the first sequence correctly", () => {
                chai.expect(genA.next()).to.eql(430625591)
                chai.expect(genA.next()).to.eql(1233683848)
                chai.expect(genA.next()).to.eql(1431495498)
                chai.expect(genA.next()).to.eql(137874439)
                chai.expect(genA.next()).to.eql(285222916)
            })
        })

        describe("judge", () => {
            it("should find 1 match in the first 5 samples", () => {
                const genA = new day15.Generator(65, 16807)
                const genB = new day15.Generator(8921, 48271)

                const judge = new day15.Judge(genA, genB)
                chai.expect(judge.multiSample(5)).to.eql(1)
            })

            it("should find 588 pairs in 40M samples", () => {
                const genA = new day15.Generator(65, 16807)
                const genB = new day15.Generator(8921, 48271)

                const judge = new day15.Judge(genA, genB)
                chai.expect(judge.multiSample(40000000)).to.eql(588)
            })
        })
    })

    describe("part2", () => {
        describe("Filter", () => {
            describe("generator A", () => {
                const gen = new day15.Generator(65, 16807)
                const gen2 = new day15.Filter(gen, x => x % 4 === 0)
                it("should generate the first sequence correctly", () => {
                    chai.expect(gen2.next()).to.eql(1352636452)
                    chai.expect(gen2.next()).to.eql(1992081072)
                    chai.expect(gen2.next()).to.eql(530830436)
                    chai.expect(gen2.next()).to.eql(1980017072)
                    chai.expect(gen2.next()).to.eql(740335192)
                })
            })
    
            describe("generator B", () => {
                const gen = new day15.Generator(8921, 48271)
                const gen2 = new day15.Filter(gen, x => x % 8 === 0)
                it("should generate the first sequence correctly", () => {
                    chai.expect(gen2.next()).to.eql(1233683848)
                    chai.expect(gen2.next()).to.eql(862516352)
                    chai.expect(gen2.next()).to.eql(1159784568)
                    chai.expect(gen2.next()).to.eql(1616057672)
                    chai.expect(gen2.next()).to.eql(412269392)
                })
            })
        })
        
        describe("judge", () => {
            it("should find 1 match in the first 5 samples", () => {
                const genA = new day15.Generator(65, 16807)
                const genB = new day15.Generator(8921, 48271)
                const genA2 = new day15.Filter(genA, x => x % 4 === 0)
                const genB2 = new day15.Filter(genB, x => x % 8 === 0)

                const judge = new day15.Judge(genA2, genB2)
                chai.expect(judge.multiSample(1056)).to.eql(1)
            })

            it("should find 588 pairs in 40M samples", () => {
                const genA = new day15.Generator(65, 16807)
                const genB = new day15.Generator(8921, 48271)
                const genA2 = new day15.Filter(genA, x => x % 4 === 0)
                const genB2 = new day15.Filter(genB, x => x % 8 === 0)

                const judge = new day15.Judge(genA2, genB2)
                chai.expect(judge.multiSample(5000000)).to.eql(309)
            })
        })
    })
})