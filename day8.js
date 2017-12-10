function Interpreter() {
    this.registers = {}
}

Interpreter.prototype.getRegister = function(register) {
    return this.registers[register] || 0
}

Interpreter.prototype.adjustRegister = function(register, by) {
    this.registers[register] = (this.registers[register] || 0) + by
}

Interpreter.prototype.evaluate = function(command) {
    const match = /^(\w+)\s(inc|dec)\s(-?\d+)\sif\s(\w+)\s([><!=]+)\s(-?\d+)$/.exec(command)
    if (!match) {
        console.error("could not parse command: %s", command)
        return
    }

    const assignment = {
        operand: match[2],
        left: match[1],
        right: parseInt(match[3])
    }

    const conditional = {
        operand: match[5],
        left: () => this.getRegister(match[4]),
        right: () => parseInt(match[6])
    }

    if (this.evaluateIf(conditional))
        this.evaluateAssignment(assignment)
}

Interpreter.prototype.evaluateIf = function(conditional) {
    switch(conditional.operand) {
        case ">":
            return conditional.left() > conditional.right()
        case "<":
            return conditional.left() < conditional.right()
        case "==":
            return conditional.left() == conditional.right()
        case ">=":
            return conditional.left() >= conditional.right()
        case "<=":
            return conditional.left() <= conditional.right()
        case "!=":
            return conditional.left() != conditional.right()
        default:
            console.log("unknown operand %s", conditional.operand)
            return false
    }
}

Interpreter.prototype.evaluateAssignment = function(assignment) {
    switch(assignment.operand) {
        case "inc":
            this.adjustRegister(assignment.left, assignment.right)
            break
        case "dec":
            this.adjustRegister(assignment.left, -assignment.right)
            break
        default:
            console.log("unknown operand %s", assignment.operand)
            return
    }
}

exports.Interpreter = Interpreter