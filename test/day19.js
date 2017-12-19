const chai = require("chai")
const fs = require("fs")
const day19 = require("../day19")

describe("day19", () => {
    describe("part1", () => {
        const file = fs.readFileSync("data/day19e.txt", "utf8")
        const field = day19.parseField(file)
        
        const walker = new day19.Walker(field)

        it("should find the start correctly", () => {
            chai.expect(walker.y).to.eql(0)
            chai.expect(walker.x).to.eql(5)
        })

        it("should set the correct start direction", () => {
            chai.expect(walker.direction).to.eql("y+")
        })

        it("should proceed to the first letter", () => {
            for(let i = 0; i < 2; i++)
                chai.expect(walker.next()).to.be.true

            chai.expect(walker.x).to.eql(5)
            chai.expect(walker.y).to.eql(2)
            chai.expect(walker.path).to.eql(["A"])
        })

        it("should proceed to the first junction", () => {
            for(let i = 0; i < 3; i++)
                chai.expect(walker.next()).to.be.true

            chai.expect(walker.x).to.eql(5)
            chai.expect(walker.y).to.eql(5)
        })

        it("should then change direction and find B", () => {
            chai.expect(walker.next()).to.be.true

            chai.expect(walker.direction).to.eql("x+")
            chai.expect(walker.x).to.eql(6)
            chai.expect(walker.y).to.eql(5)
            chai.expect(walker.path).to.eql(["A", "B"])
        })

        it("should walk the rest of the path", () => {
            let iterations = 0
            while(walker.next())
                chai.expect(iterations).to.be.lessThan(100)

            chai.expect(walker.direction).to.eql("x-")
            chai.expect(walker.x).to.eql(1)
            chai.expect(walker.y).to.eql(3)
            chai.expect(walker.path).to.eql(["A", "B", "C", "D", "E", "F"])
        })
    })
})