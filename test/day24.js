const chai = require("chai")
const fs = require("fs")
const day24 = require("../day24")

describe("day24", () => {
    describe("parser", () => {
        const parser = new day24.Parser()

        describe("parseComponentType", () => {
            const examples = [
                "0",
                "1",
                "5",
                "12",
                "50"
            ]

            examples.forEach(example => {
                it(`should parse a valid component like '${example}'`, () => {
                    chai.expect(parser.parseComponentType(example)).to.eql(parseFloat(example))
                })
            })
        })
        
        describe("parseComponent", () => {
            const examples = {
                "0/1": [0, 1],
                "1/2": [1, 2],
                "2/1": [1, 2],
                "12/50": [12, 50]
            }

            Object.keys(examples).forEach(example => {
                it(`should parse a valid component like '${example}'`, () => {
                    const component = parser.parseComponent(example)
                    chai.expect(component).to.be.instanceOf(day24.Component)
                    chai.expect(component).to.have.property("ports").eql(examples[example])
                })
            })
        })
    })

    describe("component", () => {
        it("should calculate the value correctly", () => {
            chai.expect(new day24.Component(1, 2)).to.have.property("value").eql(3)
        })

        it("should identify when it can connect to a specific port", () => {
            chai.expect(new day24.Component(0, 7).canConnectTo(new day24.Component(0))).to.be.true
            chai.expect(new day24.Component(0, 7).canConnectTo(new day24.Component(7, 12))).to.be.true
            chai.expect(new day24.Component(0, 7).canConnectTo(new day24.Component(5, 12))).to.be.false
        })

        it("should allow you to create a new component with a port removed for a connection", () => {
            chai.expect(new day24.Component(0, 7).withConnection(0)).to.have.property("ports").eql([7])
            chai.expect(new day24.Component(0, 7).withConnection(7)).to.have.property("ports").eql([0])
        })
    })

    describe("bridge", () => {
        it("should throw an error if it doesn't receive valid components", () => {
            chai.expect(() => new day24.Bridge(new day24.Component(1,2))).to.throw
        })

        it("should have the '0' component at its root", () => {
            chai.expect(new day24.Bridge()).to.have.property("root").with.property("ports").eql([0])
        })

        it("should have the '0' component as its first leaf", () => {
            chai.expect(new day24.Bridge()).to.have.property("leaf").with.property("ports").eql([0])
        })

        it("should correctly attach the first component", () => {
            const bridge = new day24.Bridge(new day24.Component(0, 4))
            chai.expect(bridge).to.have.property("components").with.length(1)
            chai.expect(bridge).to.have.property("leaf").with.property("ports").eql([4])
        })

        it("should correctly calculate its value", () => {
            const bridge = new day24.Bridge(new day24.Component(0, 4))
            chai.expect(bridge).to.have.property("value", 4)
        })

        it("should correctly calculate its length", () => {
            chai.expect(new day24.Bridge()).to.have.length(0)
        })
    })

    describe("builder", () => {
        
    })

    describe("part1", () => {
        const exampleData = fs.readFileSync("data/day24e.txt", "utf8")
        const parser = new day24.Parser()
        const components = exampleData.trim().split("\n").map(x => parser.parseComponent(x))
        const builder = new day24.Builder(...components)
        
        it("should build 11 bridges", () => {
            const bridges = [...builder.build()]
            chai.expect(bridges).to.have.length(11)
        })

        it("should identify 0/1--10/1--9/10 as the strongest bridge", () => {
            const best = builder.strongest()
            chai.expect(best).to.exist
            chai.expect(best).to.have.property("value", 31)
            chai.expect(best.toString()).to.eql("0/1--1/10--9/10")
        })

        it("should identify 0/2--2/2--2/3--3/5 as the longest bridge", () => {
            const best = builder.longest()
            chai.expect(best).to.exist
            chai.expect(best).to.have.property("length", 4)
            chai.expect(best).to.have.property("value", 19)
            chai.expect(best.toString()).to.eql("0/2--2/2--2/3--3/5")
        })
    })
})