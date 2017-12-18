const chai = require("chai")
const fs = require("fs")
const day18 = require("../day18")

describe("day18", () => {
    describe("part1", () => {
        const instructions = fs.readFileSync("data/day18e1.txt", "utf8").split("\n").map(x => x.trim())
        const hub = new day18.LoopbackHub()
        const interpreter = new day18.Interpreter(instructions, hub.subscribe(), {safeReceive: 1})

        it("should first set a to 1", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("instruction", "set a 1")
            chai.expect(result).to.have.property("type", "set")
            chai.expect(result).to.have.property("args").eql(["a", 1])

            chai.expect(result).to.have.property("registers").to.have.property("a", 1)
        })

        it("should then add 2 to it", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 3)
        })
        
        it("should then square it", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 9)
        })
        
        it("should then take the modulo 5 of it", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 4)
        })

        it("should then send 4", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 4)
            chai.expect(interpreter.state.hub.queue).to.have.length(1)
        })

        it("should then set a back to 0", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 0)
        })
        
        it("should skip the rcv because a is 0", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("type", "rcv")
            chai.expect(result).to.have.property("registers").to.have.property("a", 0)
        })
        
        it("should skip the jgz because a is 0", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("type", "jgz")
            chai.expect(result).to.have.property("registers").to.have.property("a", 0)
        })
        
        it("should then set a to 1", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("registers").to.have.property("a", 1)
        })
        
        it("should jump back two instructions", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("type", "jgz")
            chai.expect(result).to.have.property("result").which.is.true
        })

        it("should then jump back another instruction", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("type", "jgz")
            chai.expect(result).to.have.property("result").which.is.true
        })

        it("should then receive the last sent number", () => {
            const result = interpreter.next()
            chai.expect(result).to.not.be.false
            chai.expect(result).to.have.property("type", "rcv")
            chai.expect(result).to.have.property("registers").to.have.property("a", 4)
        })
    })

    describe("part2", () => {
        describe("example1", () => {
            const instructions = fs.readFileSync("data/day18e1.txt", "utf8").split("\n").map(x => x.trim())
            const hub = new day18.Hub()
            const int1 = new day18.Interpreter(instructions, hub.subscribe())
            const exec = new day18.ParallelExecutor(int1)

            before(() => {
                const sub = hub.subscribe()
                sub.send(4)
                sub.send(2)
                while(exec.next());
            })

            it("should populate program 0's registers correctly", () => {
                chai.expect(int1.state.registers).to.eql({
                    a: 2
                })
            })
        })

        describe("example2", () => {
            const instructions = fs.readFileSync("data/day18e2.txt", "utf8").split("\n").map(x => x.trim())
            const hub = new day18.Hub()
            const int1 = new day18.Interpreter(instructions, hub.subscribe(), { p: 0 })
            const int2 = new day18.Interpreter(instructions, hub.subscribe(), { p: 1 })
            const exec = new day18.ParallelExecutor(int1, int2)

            before(() => {
                while(exec.next());
            })

            it("should populate program 0's registers correctly", () => {
                chai.expect(int1.state.registers).to.eql({
                    p: 0,
                    a: 1,
                    b: 2,
                    c: 1
                })
            })
            
            it("should populate program 1's registers correctly", () => {
                chai.expect(int2.state.registers).to.eql({
                    p: 1,
                    a: 1,
                    b: 2,
                    c: 0
                })
            })
        })
    })
})