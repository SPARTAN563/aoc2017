const chai = require("chai")
const fs = require("fs")
const day22 = require("../day22")

describe("day22", () => {
    const data = {
        example: fs.readFileSync("data/day22e.txt", "utf8"),
        puzzle: fs.readFileSync("data/day22.txt", "utf8")
    }

    describe("Parser", () => {
        const parser = new day22.Parser()
        describe("parseNode", () => {
            it("should throw an error if it receives an invalid character", () => {
                chai.expect(() => parser.parseNode("x")).to.throw
            })

            it("should return true for an infected node", () => {
                chai.expect(parser.parseNode("#")).to.eql(1)
            })

            it("should return false for an infected node", () => {
                chai.expect(parser.parseNode(".")).to.eql(0)
            })
        })

        describe("parseRow", () => {
            it("should return the list of nodes in a row", () => {
                chai.expect(parser.parseRow(".#.")).to.eql([0, 1, 0])
            })
        })

        describe("parseGrid", () => {
            it("should parse the full grid", () => {
                chai.expect(parser.parseGrid(".#\n#.")).to.eql([[0, 1], [1, 0]])
            })

            it("should parse the example input", () => {
                chai.expect(parser.parseGrid(data.example)).to.eql([
                    [0, 0, 1],
                    [1, 0, 0],
                    [0, 0, 0]
                ])
            })
        })
    })

    describe("InfiniteGrid", () => {
        const grid = new day22.InfiniteGrid([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ])

        it("should initialize correctly", () => {
            chai.expect(grid).to.have.property("infected").eql({
                "(-1,-1)": 1,
                "(0,0)": 1
            })
        })

        it("should get the state of a node correctly", () => {
            chai.expect(grid.get(-1, -1)).to.eql(1)
            chai.expect(grid.get(1,1)).to.eql(0)
        })

        it("should set the state of a node correctly", () => {
            chai.expect(grid.set(1, 3, 1)).to.eql(1)
            chai.expect(grid.get(1,3)).to.eql(1)
        })

        it("should infect a node correctly", () => {
            chai.expect(grid.infect(1,1)).to.eql(1)
            chai.expect(grid.get(1,1)).to.eql(1)

            chai.expect(grid.infect(1,5)).to.eql(1)
            chai.expect(grid.get(1,5)).to.eql(1)
        })

        it("should clean a node correctly", () => {
            chai.expect(grid.clean(0,0)).to.eql(0)
            chai.expect(grid.get(0,0)).to.eql(0)
        })

        it("should toggle a node correctly", () => {
            chai.expect(grid.toggle(0,0)).to.eql(1)
            chai.expect(grid.get(0,0)).to.eql(1)

            chai.expect(grid.toggle(0,0)).to.eql(0)
            chai.expect(grid.get(0,0)).to.eql(0)
        })
    })

    describe("Carrier", () => {
        const parser = new day22.Parser()

        describe("toggle mode", () => {
            const grid = new day22.InfiniteGrid(parser.parseGrid(data.example))
            const carrier = new day22.Carrier(grid)
            it("should start facing north", () => {
                chai.expect(carrier.direction).to.eql("N")
            })

            it("should start at (0,0)", () => {
                chai.expect(carrier.x).to.eql(0)
                chai.expect(carrier.y).to.eql(0)
            })

            it("should return true after the next step", () => {
                chai.expect(carrier.next())
            })

            it("should be facing west after moving", () => {
                chai.expect(carrier.direction).to.eql("W")
            })

            it("should have moved to (-1, 0)", () => {
                chai.expect(carrier.x).to.eql(-1)
                chai.expect(carrier.y).to.eql(0)
            })

            it("should have infected one node", () => {
                chai.expect(carrier.stats.moved).to.eql(1)
                chai.expect(carrier.stats.infected).to.eql(1)
                chai.expect(carrier.stats.cleaned).to.eql(0)
            })

            it("should have updated the infinite grid", () => {
                chai.expect(grid.get(0,0)).to.eql(1)
            })

            describe("after 7 steps", () => {
                before(() => {
                    while(carrier.stats.moved < 7)
                        carrier.next()
                })

                it("should then have infected 5 nodes", () => {
                    chai.expect(carrier.stats.moved).to.eql(7)
                    chai.expect(carrier.stats.infected).to.eql(5)
                    chai.expect(carrier.stats.cleaned).to.eql(2)
                })
            })

            describe("after 70 steps", () => {
                before(() => {
                    while(carrier.stats.moved < 70)
                        carrier.next()
                })

                it("should then have infected 41 nodes", () => {
                    chai.expect(carrier.stats.moved).to.eql(70)
                    chai.expect(carrier.stats.infected).to.eql(41)
                    chai.expect(carrier.stats.cleaned).to.eql(29)
                })
            })

            describe("after 10000 steps", () => {
                before(() => {
                    while(carrier.stats.moved < 10000)
                        carrier.next()
                })

                it("should then have infected 5587 nodes", () => {
                    chai.expect(carrier.stats.moved).to.eql(10000)
                    chai.expect(carrier.stats.infected).to.eql(5587)
                    chai.expect(carrier.stats.cleaned).to.eql(carrier.stats.moved - carrier.stats.infected)
                })
            })
        })

        describe("evolve mode", () => {
            const grid = new day22.InfiniteGrid(parser.parseGrid(data.example))
            const carrier = new day22.Carrier(grid, "evolve")
            it("should start facing north", () => {
                chai.expect(carrier.direction).to.eql("N")
            })

            it("should start at (0,0)", () => {
                chai.expect(carrier.x).to.eql(0)
                chai.expect(carrier.y).to.eql(0)
            })

            it("should return true after the next step", () => {
                chai.expect(carrier.next())
            })

            it("should be facing west after moving", () => {
                chai.expect(carrier.direction).to.eql("W")
            })

            it("should have moved to (-1, 0)", () => {
                chai.expect(carrier.x).to.eql(-1)
                chai.expect(carrier.y).to.eql(0)
            })

            it("should have weakened one node", () => {
                chai.expect(carrier.stats.moved).to.eql(1)
                chai.expect(carrier.stats.infected).to.eql(0)
                chai.expect(carrier.stats.weakened).to.eql(1)
                chai.expect(carrier.stats.cleaned).to.eql(0)
            })

            it("should have updated the infinite grid", () => {
                chai.expect(grid.get(0,0)).to.eql(2)
            })

            const samples = [
                {
                    steps: 1,
                    weakened: 1,
                    flagged: 0,
                    infected: 0,
                    cleaned: 0,
                    direction: "W",
                    current: 1,
                    currentPos: [-1,0]
                },
                {
                    steps: 2,
                    weakened: 1,
                    flagged: 1,
                    infected: 0,
                    cleaned: 0,
                    direction: "N",
                    current: 0,
                    currentPos: [-1,-1]
                },
                {
                    steps: 5,
                    weakened: 4,
                    flagged: 1,
                    infected: 0,
                    cleaned: 0,
                    direction: "E",
                    current: 3,
                    currentPos: [-1,0]
                },
                {
                    steps: 6,
                    weakened: 4,
                    flagged: 1,
                    infected: 0,
                    cleaned: 1,
                    direction: "W",
                    current: 2,
                    currentPos: [-2,0]
                },
                {
                    steps: 7,
                    weakened: 4,
                    flagged: 1,
                    infected: 1,
                    cleaned: 1,
                    direction: "W",
                    current: 0,
                    currentPos: [-3,0]
                },
                {
                    steps: 8,
                    weakened: 5,
                    flagged: 1,
                    infected: 1,
                    cleaned: 1,
                    direction: "S",
                    current: 0,
                    currentPos: [-3,1]
                },
                {
                    steps: 9,
                    weakened: 6,
                    flagged: 1,
                    infected: 1,
                    cleaned: 1,
                    direction: "E",
                    current: 0,
                    currentPos: [-2,1]
                },
                {
                    steps: 100,
                    infected: 26
                }
            ]

            samples.forEach(sample => {
                describe(`after ${sample.steps} steps`, () => {
                    before(() => {
                        while(carrier.stats.moved < sample.steps)
                            carrier.next()

                        if(sample.debug)
                            console.log(`${JSON.stringify(carrier.grid, null, 2)}\n`)
                    })

                    it(`should have moved ${sample.steps} steps`, () => {
                        chai.expect(carrier.stats.moved).to.eql(sample.steps)
                    })

                    if(sample.direction !== undefined)
                        it(`should be facing ${sample.direction}`, () => {
                            chai.expect(carrier.direction).to.eql(sample.direction)
                        })

                    if(sample.current !== undefined)
                        it(`should be on a node with state ${sample.current}`, () => {
                            chai.expect(carrier.grid.get(carrier.x, carrier.y)).to.eql(sample.current)
                        })

                    if(sample.currentPos)
                        it(`should be on at (${sample.currentPos[0]},${sample.currentPos[1]})`, () => {
                            chai.expect(carrier.x).to.eql(sample.currentPos[0])
                            chai.expect(carrier.y).to.eql(sample.currentPos[1])
                        })

                    if(sample.cleaned !== undefined)
                        it(`should have cleaned ${sample.cleaned} nodes`, () => {
                            chai.expect(carrier.stats.cleaned).to.eql(sample.cleaned)
                        })

                    if(sample.flagged !== undefined)
                        it(`should have flagged ${sample.flagged} nodes`, () => {
                            chai.expect(carrier.stats.flagged).to.eql(sample.flagged)
                        })

                    if(sample.weakened !== undefined)
                        it(`should have weakened ${sample.weakened} nodes`, () => {
                            chai.expect(carrier.stats.weakened).to.eql(sample.weakened)
                        })

                    if(sample.infected !== undefined)
                        it(`should have infected ${sample.infected} nodes`, () => {
                            chai.expect(carrier.stats.infected).to.eql(sample.infected)
                        })
                })
            })

            describe.skip("after 10M steps", () => {
                before(() => {
                    while(carrier.stats.moved < 10e6)
                        carrier.next()
                })

                it("should then have infected 2511944 nodes", () => {
                    chai.expect(carrier.stats.moved).to.eql(10e6)
                    chai.expect(carrier.stats.infected).to.eql(2511944)
                })
            })
        })
    })
})