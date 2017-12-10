const chai = require("chai")
const day9 = require("../day9")
const fs = require("fs")

function checkStructureMatches(root, groups) {
    chai.expect(root.children).to.have.length(groups.length)
    root.children.forEach((child, i) => {
        const expected = groups[i]
        if (Array.isArray(expected)) {
            chai.expect(child).to.have.property("type", "group")
            checkStructureMatches(child, expected)
        } else if (typeof expected === "string") {
            chai.expect(child).to.have.property("type", "garbage")
            chai.expect(child.children.join("")).to.eql(expected)
        }
    })
}

function scoreGroups(root, score=1) {
    const children = root.children.filter(c => c.type === "group")

    return score + children.reduce((sum, c) => sum + scoreGroups(c, score + 1), 0)
}

describe("day9", () => {
    describe("part1", () => {
        describe("garbage parsing", () => {
            let parser = new day9.Parser()
            beforeEach(() => parser = new day9.Parser())

            it("<>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                parser.next("<")
                chai.expect(parser.stack).to.have.length(3)
                chai.expect(parser.current()).to.have.property("type").eql("garbage")

                parser.next(">")
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)
            })

            it("<random characters>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                "<random characters>".split("").forEach(char => parser.next(char))
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                const garbage = parser.current().children[0]
                chai.expect(garbage.children.join("")).to.eql("random characters")
            })

            it("<<<>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                "<<<>".split("").forEach(char => parser.next(char))
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                const garbage = parser.current().children[0]
                chai.expect(garbage.children.join("")).to.eql("<<")
            })
            
            it("<{!>}>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                "<{!>}>".split("").forEach(char => parser.next(char))
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                const garbage = parser.current().children[0]
                chai.expect(garbage.children.join("")).to.eql("{}")
            })
            
            it("<!!>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                "<!!>".split("").forEach(char => parser.next(char))
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                const garbage = parser.current().children[0]
                chai.expect(garbage.children.join("")).to.eql("")
            })
            
            it("<!!!>>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                "<!!!>>".split("").forEach(char => parser.next(char))
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                const garbage = parser.current().children[0]
                chai.expect(garbage.children.join("")).to.eql("")
            })
            
            it("<{o\"i!a,<{i<a>", () => {
                parser.newGroup()
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")

                "<{o\"i!a,<{i<a>".split("").forEach(char => parser.next(char))
                chai.expect(parser.stack).to.have.length(2)
                chai.expect(parser.current()).to.have.property("type").eql("group")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                const garbage = parser.current().children[0]
                chai.expect(garbage.children.join("")).to.eql("{o\"i,<{i<a")
            })
        })

        describe("group parsing", () => {
            let parser = new day9.Parser()
            beforeEach(() => parser = new day9.Parser())

            it("{}", () => {
                "{}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)
            })
            
            it("{{{}}}", () => {
                "{{{}}}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], [[[]]])
            })
            
            it("{{},{}}", () => {
                "{{},{}}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], [[],[]])
            })

            it("{{{},{},{{}}}}", () => {
                "{{{},{},{{}}}}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], [[[],[],[[]]]])
            })
            
            it("{<{},{},{{}}>}", () => {
                "{<{},{},{{}}>}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], ["{},{},{{}}"])
            })
            
            it("{<a>,<a>,<a>,<a>}", () => {
                "{<a>,<a>,<a>,<a>}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], ["a", "a", "a", "a"])
            })

            it("{{<a>},{<a>},{<a>},{<a>}}", () => {
                "{{<a>},{<a>},{<a>},{<a>}}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], [["a"], ["a"], ["a"], ["a"]])
            })

            it("{{<!>},{<!>},{<!>},{<a>}}", () => {
                "{{<!>},{<!>},{<!>},{<a>}}".split("").forEach(char => parser.next(char))
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                checkStructureMatches(parser.current().children[0], [["},{<},{<},{<a"]])
            })
        })
        
        describe("group scoring", () => {
            const groups = {
                "{}": 1,
                "{{{}}}": 6,
                "{{},{}}": 5,
                "{{{},{},{{}}}}": 16,
                "{<a>,<a>,<a>,<a>}": 1,
                "{{<ab>},{<ab>},{<ab>},{<ab>}}": 9,
                "{{<!!>},{<!!>},{<!!>},{<!!>}}": 9,
                "{{<a!>},{<a!>},{<a!>},{<ab>}}": 3
            }

            Object.keys(groups).map(group => {
                it(group, () => {
                    const parser = new day9.Parser()
                    parser.parse(group)
                    chai.expect(parser.current()).to.have.property("type").eql("root")
                    chai.expect(parser.current()).to.have.property("children").with.length(1)

                    chai.expect(scoreGroups(parser.current().children[0])).to.eql(groups[group])
                })
            })
        })

        describe("problem", () => {
            it("should calculate the solution", () => {
                const input = fs.readFileSync("data/day9.txt", "utf8")
                const parser = new day9.Parser()
                parser.parse(input)
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                console.log("Total score for input: %d", scoreGroups(parser.current().children[0]))
            })
        })
    })

    describe("part2", () => {
        function countGarbage(root) {
            const children = root.children.filter(x => x.type === "group")
            const garbage = root.children.filter(x => x.type === "garbage")

            return children.reduce((sum, c) => sum + countGarbage(c), 0) + garbage.reduce((sum, g) => sum + g.children.length, 0)
        }

        describe("examples", () => {
            const examples = {
                "<>": 0,
                "<random characters>": 17,
                "<<<<>": 3,
                "<{!>}>": 2,
                "<!!>": 0,
                "<!!!>>": 0,
                "<{o\"i!a,<{i<a>": 10
            }

            Object.keys(examples).forEach(example => {
                it(example, () => {
                    const parser = new day9.Parser()
                    parser.newGroup()
                    parser.parse(example)
                    chai.expect(parser.current()).to.have.property("type").eql("group")
                    chai.expect(parser.current()).to.have.property("children").with.length(1)

                    chai.expect(countGarbage(parser.current())).to.eql(examples[example])
                })
            })
        })

        describe("problem", () => {
            it("should find the solution", () => {
                const input = fs.readFileSync("data/day9.txt", "utf8")
                const parser = new day9.Parser()
                parser.parse(input)
                chai.expect(parser.current()).to.have.property("type").eql("root")
                chai.expect(parser.current()).to.have.property("children").with.length(1)

                console.log("Total garbage in input: %d", countGarbage(parser.current().children[0]))
            })
        })
    })
})