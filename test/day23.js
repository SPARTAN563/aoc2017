const chai = require("chai")
const fs = require("fs")
const day23 = require("../day23")

describe("day23", () => {
    describe("part1", () => {
        const instructions = fs.readFileSync("data/day23e.txt", "utf8").split("\n").map(x => x.trim())
        const interpreter = new day23.Interpreter(instructions, {})

        it("should first set a to 1", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("instruction", "set a 1")
            chai.expect(result).to.have.property("type", "set")
            chai.expect(result).to.have.property("args").eql(["a", 1])

            chai.expect(result).to.have.property("registers").to.have.property("a", 1)
        })

        it("should then set b to 2", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("b", 2)
        })
        
        it("should then multiply a by 3", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 3)
        })
        
        it("should then add 1 to b", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("b", 3)
        })

        it("should then jump over the 'sub a b' instruction", () => {
            chai.expect(interpreter.next()).to.not.be.false
            const result = interpreter.next()
            chai.expect(result).to.have.property("registers").to.have.property("a").not.eql(0)
        })
        
        it("should then set c to 1 and exit", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("c", 1)
            chai.expect(interpreter.next()).to.be.false
        })
    })

    describe("findPrimeNumbers", () => {
        it("should find 5 composites between 3 and 15", () => {
            chai.expect(day23.findCompositeNumbers(3, 15, 1)).to.eql(6)
        })
    })
})