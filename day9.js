/**
 * 
 */

function Parser() {
    this.stack = [{
        type: "root",
        children: [],
        on: {
            "{": () => this.newGroup(),
            "\n": () => {},
            "\r": () => {}
        }
    }]
}

Parser.prototype.parse = function(string) {
    string.split("").forEach(char => this.next(char))
}

Parser.prototype.next = function(char) {
    const current = this.current()
    if (current.on[char])
        current.on[char]()
    else if (current.on.default)
        current.on.default(char)
    else
        throw new Error(`Unexpected character '${char}' encountered for state ${current.type}`)
}

Parser.prototype.current = function() {
    return this.stack[this.stack.length - 1]
}

Parser.prototype.pop = function() {
    return this.stack.pop()
}

Parser.prototype.newGroup = function() {
    const newGroup = {
        type: "group",
        children: [],
        on: {
            "{": () => this.newGroup(),
            "<": () => this.newGarbage(),
            "}": () => {
                this.pop()
            },
            ",": () => {}
        }
    }

    const current = this.current()
    current.children.push(newGroup)
    this.stack.push(newGroup)
}

Parser.prototype.newGarbage = function() {
    const newGarbage = {
        type: "garbage",
        children: [],
        on: {
            ">": () => {
                this.pop()
            },
            "!": () => this.newCancel(),
            "default": (char) => {
                this.current().children.push(char)
            }
        }
    }

    const current = this.current()
    current.children.push(newGarbage)
    this.stack.push(newGarbage)
}

Parser.prototype.newCancel = function() {
    const newCancel = {
        type: "cancel",
        children: [],
        on: {
            "default": char => {
                this.pop()
            }
        }
    }

    this.stack.push(newCancel)
}

exports.Parser = Parser