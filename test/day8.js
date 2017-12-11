const chai = require("chai")
const fs = require("fs")
const day8 = require("../day8")

describe("day8", () => {
    describe("part1", () => {
        describe("example", () => {
            const interpreter = new day8.Interpreter()

            it("should not do anything for I1", () => {
                interpreter.evaluate("b inc 5 if a > 1")
                chai.expect(interpreter.registers).to.eql({})
            })

            it("should increase a to 1 for I2", () => {
                interpreter.evaluate("a inc 1 if b < 5")
                chai.expect(interpreter.registers).to.eql({a: 1})
            })
            
            it("should increase c to 10 for I3", () => {
                interpreter.evaluate("c dec -10 if a >= 1")
                chai.expect(interpreter.registers).to.eql({a: 1, c: 10})
            })
            
            it("should increase c to -10 for I4", () => {
                interpreter.evaluate("c inc -20 if c == 10")
                chai.expect(interpreter.registers).to.eql({a: 1, c: -10})
            })
        })
    })

    describe("part2", () => {
        describe("example", () => {
            const interpreter = new day8.Interpreter()
            const instructions = fs.readFileSync("data/day8e.txt", "utf8").split("\n").map(x => x.trim())

            it("should calculate the max instruction value at any point", () => {
                let globalMax = Number.MIN_SAFE_INTEGER
                instructions.forEach(instruction => {
                    interpreter.evaluate(instruction)
                    const max = Object.keys(interpreter.registers).map(k => interpreter.registers[k]).sort((a, b) => a > b ? 1 : -1).reverse()[0]
                    if (max === undefined) return
                    globalMax = Math.max(max, globalMax)
                })

                chai.expect(globalMax).to.eql(10)
            })
        })
    })
})