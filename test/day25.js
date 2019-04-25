const chai = require("chai")
const day25 = require("../day25")

describe.only("day25", () => {
    describe("Tape", () => {
        const tape = new day25.Tape()

        it("should return 0 by default", () => {
            chai.expect(tape.current()).to.eql(0)
        })

        it("should start at position 0", () => {
            chai.expect(tape.cursor).to.eql(0)
        })

        it("should allow us to write a value to the current position", () => {
            tape.write(1)
            chai.expect(tape.current()).to.eql(1)
        })

        it("should allow us to move left into the negatives", () => {
            // Reset for test
            tape.cursor = 0

            tape.moveLeft()
            tape.moveLeft()
            chai.expect(tape.cursor).to.eql(-2)
            chai.expect(tape.current()).to.eql(0)
        })

        it("should allow us to move right into the positives", () => {
            // Reset for test
            tape.cursor = 0

            tape.moveRight()
            tape.moveRight()
            chai.expect(tape.cursor).to.eql(2)
            chai.expect(tape.current()).to.eql(0)
        })

        it("should not confuse negative and positive values", () => {
            tape.cursor = -2
            tape.write(1)

            tape.cursor = 2
            tape.write(1)
            chai.expect(tape.current()).to.eql(1)
            tape.write(0)
            chai.expect(tape.current()).to.eql(0)

            tape.cursor = -2
            chai.expect(tape.current()).to.eql(1)

        })
    })

    describe("TuringMachine", () => {
        
    })

    describe("example", () => {
        describe("with manual instantiation", () => {
            const stateA = new day25.State("A",
                new day25.Condition(x => x === 0, m => {
                    m.tape.write(1)
                    m.tape.moveRight()
                    m.changeState("B")
                }),
                new day25.Condition(x => x === 1, m => {
                    m.tape.write(0)
                    m.tape.moveLeft()
                    m.changeState("B")
                })
            )

            const stateB = new day25.State("B",
                new day25.Condition(x => x === 0, m => {
                    m.tape.write(1)
                    m.tape.moveLeft()
                    m.changeState("A")
                }),
                new day25.Condition(x => x === 1, m => {
                    m.tape.write(1)
                    m.tape.moveRight()
                    m.changeState("A")
                })
            )

            const machine = new day25.TuringMachine(stateA, stateB)

            it("should have a checksum of 3 after 6 steps", () => {
                while (machine.steps < 6)
                    machine.next()

                chai.expect(machine.checksum()).to.eql(3)
            })
        })

        describe("with buildMachine", () => {
            const machine = day25.buildMachine("A", {
                "A": {
                    "0": {
                        write: 1,
                        move: "Right",
                        next: "B"
                    },
                    "1": {
                        write: 0,
                        move: "Left",
                        next: "B"
                    }
                },
                "B": {
                    "0": {
                        write: 1,
                        move: "Left",
                        next: "A"
                    },
                    "1": {
                        write: 1,
                        move: "Right",
                        next: "A"
                    }
                }
            })

            it("should have a checksum of 3 after 6 steps", () => {
                while (machine.steps < 6)
                    machine.next()

                chai.expect(machine.checksum()).to.eql(3)
            })
        })
    })
})