const chai = require("chai");
const day7 = require("../day7");

describe("day7", () => {
    describe("Parser", () => {
        const parser = new day7.Parser("data/day7e1.txt")
        
        it("should load the lines from the file", () => {
            chai.expect(parser.lines).to.have.lengthOf(13)
        })

        it("should parse lines without children", () => {
            for (let i = 0; i < 5; i++) {
                const parsed = parser.next()
                chai.expect(parsed).to.exist.and.not.be.null
                chai.expect(parsed).to.have.ownProperty("id").match(/^\w{4}$/)
                chai.expect(parsed).to.have.ownProperty("weight").is.a("number").greaterThan(55).lessThan(70)
                chai.expect(parsed).to.have.ownProperty("children").eql([])
            }
        })

        it("should parse lines with children", () => {
            const parsed = parser.next()
            chai.expect(parsed).to.exist
            chai.expect(parsed.id).to.eql("fwft")
            chai.expect(parsed.children).to.eql(["ktlj", "cntj", "xhth"])
        })
    })

    describe("Builder", () => {
        describe("example", () => {
            const parser = new day7.Parser("data/day7e1.txt")
            const builder = new day7.Builder()

            it("should build the first node correctly", () => {
                const node = parser.next()
                builder.attach(node)

                chai.expect(builder.roots).to.have.lengthOf(1)
                chai.expect(builder.roots[0].id).to.eql(node.id)
            })


            it("should build the next 4 nodes correctly", () => {
                for (let i = 0; i < 4; i++) {
                    const node = parser.next()
                    builder.attach(node)
                }

                chai.expect(builder.roots).to.have.lengthOf(5)
            })

            it("should then compress when a new root is discovered", () => {
                const node = parser.next()
                chai.expect(node.children).to.have.length(3)
                builder.attach(node)
                chai.expect(builder.roots).to.have.length(4)
                chai.expect(Object.keys(builder.leaves)).to.have.length(7)
            })

            it("should continue to build the rest of the tree", () => {
                let node = null;
                while (node = parser.next()) {
                    builder.attach(node)
                }

                chai.expect(builder.roots).to.have.length(1)
                chai.expect(builder.roots[0]).to.have.property("id").eql("tknk")
            })
        })
    })

    describe("part1", () => {
        it("should calculate the solution", () => {
            const parser = new day7.Parser("data/day7.txt")
            const builder = new day7.Builder()

            let node = null;
            while(node = parser.next()) {
                builder.attach(node)
            }

            chai.expect(builder.roots).to.have.length(1)
            const root = builder.roots[0]
            console.log(root.id)
        })
    })

    describe("part2", () => {
        describe("example", () => {
            const parser = new day7.Parser("data/day7e1.txt")
            const builder = new day7.Builder()

            before(() => {
                let node = null;
                while(node = parser.next()) {
                    builder.attach(node)
                }

                chai.expect(builder.roots).to.have.length(1)
            })

            it("should find the unbalanced nodes", () => {
                const balancer = new day7.Balancer()
                balancer.visit(builder.roots[0])

                chai.expect(balancer.unbalanced).to.have.length(1)
                chai.expect(balancer.unbalanced[0]).to.have.property("id").eql("tknk")
            })
        })

        describe("solution", () => {
            const parser = new day7.Parser("data/day7.txt")
            const builder = new day7.Builder()

            before(() => {
                let node = null;
                while(node = parser.next()) {
                    builder.attach(node)
                }

                chai.expect(builder.roots).to.have.length(1)
            })

            it("should find the unbalanced nodes", () => {
                const balancer = new day7.Balancer()
                balancer.visit(builder.roots[0])

                const unbalanced = [].concat(balancer.unbalanced).sort((a, b) => {
                    const aWeight = a.childWeights.reduce((max, c) => Math.max(c.weight, max), 0)
                    const bWeight = b.childWeights.reduce((max, c) => Math.max(c.weight, max), 0)

                    return aWeight > bWeight ? 1 : -1
                })

                const highest = unbalanced[0]

                const freqDist = {}
                highest.childWeights.forEach(c => freqDist[`${c.weight}`] = (freqDist[`${c.weight}`] || 0) + 1)

                const anomalousWeight = parseInt(Object.keys(freqDist).find(k => freqDist[k] === 1))
                const targetTotalWeight = parseInt(Object.keys(freqDist).find(k => k != anomalousWeight))
                
                const changeTarget = highest.childWeights.find(c => c.weight == anomalousWeight)
                console.log(`Node ${changeTarget.id} has total weight ${changeTarget.weight}, should be ${targetTotalWeight}`)
                console.log(`Node ${changeTarget.id} should have own weight of ${changeTarget.selfWeight - (anomalousWeight - targetTotalWeight)}`)
            })
        })
    })
})