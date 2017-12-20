const chai = require("chai")
const fs = require("fs")
const day20 = require("../day20")

describe("day20", () => {
    const exampleText1 = fs.readFileSync("data/day20e1.txt", "utf8")
    const exampleText2 = fs.readFileSync("data/day20e2.txt", "utf8")
    
    describe("quadRoots", () => {
        it("should return undefined if the equation always holds", () => {
            chai.expect(day20.quadRoots(0,0,0)).to.be.undefined
        })

        it("should return a single root for non-quadratic equations", () => {
            chai.expect(day20.quadRoots(0, 2, 2)).to.eql([-1])
            chai.expect(day20.quadRoots(0, 2, 4)).to.eql([-2])
            chai.expect(day20.quadRoots(0, 2, 0)).to.eql([-0])
        })

        it("should return no roots for imaginary quadratics", () => {
            chai.expect(day20.quadRoots(1, 1, 4)).to.eql([])
        })
        
        it("should return one root for quadratic equations with repeated roots", () => {
            chai.expect(day20.quadRoots(4, 16, 16)).to.eql([-2])
        })

        it("should return two roots for quadratic equations", () => {
            chai.expect(day20.quadRoots(1, -18, 32)).to.contain(2)
            chai.expect(day20.quadRoots(1, -18, 32)).to.contain(16)
            chai.expect(day20.quadRoots(1, 18, 32)).to.contain(-2)
            chai.expect(day20.quadRoots(1, 18, 32)).to.contain(-16)
        })
    })
    describe("parser", () => {
        const parser = new day20.Parser()

        describe("parseVector", () => {
            const examples = {
                "<0,0,0>": new day20.Vector(0,0,0),
                "<1,2,3>": new day20.Vector(1,2,3),
                "<-1, 2,-3>": new day20.Vector(-1,2,-3),
                "<0.1,0.2,0.3>": new day20.Vector(0.1,0.2,0.3)
            }

            Object.keys(examples).forEach(s => {
                const ev = examples[s]
                it(`should parse the ${s} vector correctly`, () => {
                    const v = parser.parseVector(s)
                    chai.expect(v).to.have.property("x", ev.x)
                    chai.expect(v).to.have.property("y", ev.y)
                    chai.expect(v).to.have.property("z", ev.z)
                })
            })
        })

        describe("parseParticle", () => {
            const examples = {
                "p=<0,0,0>, v=<0,0,0>, a=<0,0,0>": new day20.Particle(0, new day20.Vector(0,0,0), new day20.Vector(0,0,0), new day20.Vector(0,0,0)),
                "p=<1,2,3>, v=<-1,2,-3>, a=<0.1,0.2,0.3>": new day20.Particle(0, new day20.Vector(1,2,3), new day20.Vector(-1,2,-3), new day20.Vector(0.1,0.2,0.3))
            }

            Object.keys(examples).forEach(s => {
                const ep = examples[s]
                it(`should parse the ${s} particle correctly`, () => {
                    const p = parser.parseParticle(0, s)
                    chai.expect(p).to.have.property("id", 0)
                    chai.expect(p).to.have.property("p").eql(ep.p)
                    chai.expect(p).to.have.property("v").eql(ep.v)
                    chai.expect(p).to.have.property("a").eql(ep.a)
                })
            })
        })

        describe("parseParticleField", () => {
            it("should parse the example field correctly (1)", () => {
                const pf = parser.parseParticleField(exampleText1)
                chai.expect(pf).to.exist
                chai.expect(pf).to.have.property("particles").with.length(2)
            })

            it("should parse the example field correctly (2)", () => {
                const pf = parser.parseParticleField(exampleText2)
                chai.expect(pf).to.exist
                chai.expect(pf).to.have.property("particles").with.length(4)
            })
        })
    })

    describe("vector", () => {
        it("should set the fields correctly", () => {
            const v = new day20.Vector(1, 2, 3)
            chai.expect(v.x).to.eql(1)
            chai.expect(v.y).to.eql(2)
            chai.expect(v.z).to.eql(3)
        })

        it("should correctly calculate its magnitude", () => {
            chai.expect(new day20.Vector(1,0,0)).to.have.property("magnitude", 1)
            chai.expect(new day20.Vector(1,1,1)).to.have.property("magnitude", Math.sqrt(3))
            chai.expect(new day20.Vector(1,2,3)).to.have.property("magnitude", Math.sqrt(14))
        })

        it("should correctly indicate whether it is a zero-vector", () => {
            chai.expect(new day20.Vector(0,0,0)).to.have.property("zero", true)
            chai.expect(new day20.Vector(1,0,0)).to.have.property("zero", false)
            chai.expect(new day20.Vector(0,1,0)).to.have.property("zero", false)
            chai.expect(new day20.Vector(0,0,1)).to.have.property("zero", false)
        })

        it("should correctly calculate its manhattan magnitude", () => {
            chai.expect(new day20.Vector(1,0,0)).to.have.property("manhattanMagnitude", 1)
            chai.expect(new day20.Vector(1,1,1)).to.have.property("manhattanMagnitude", 3)
            chai.expect(new day20.Vector(1,2,3)).to.have.property("manhattanMagnitude", 6)
        })

        it("should correctly calculate a vector between two other vector points", () => {
            const p1 = new day20.Vector(2,2,2)
            const p2 = new day20.Vector(3,3,3)
            const to = p1.to(p2)
            chai.expect(to).to.be.instanceOf(day20.Vector)
            chai.expect(to).to.have.property("x", 1)
            chai.expect(to).to.have.property("y", 1)
            chai.expect(to).to.have.property("z", 1)
            chai.expect(to).to.not.equal(p1)
            chai.expect(to).to.not.equal(p2)
        })

        it("should correctly calculate the distance between two vectors", () => {
            const p1 = new day20.Vector(2,2,2)
            const p2 = new day20.Vector(3,3,3)
            chai.expect(p1.distance(p2)).to.eql(Math.sqrt(3))
        })
        
        it("should correctly calculate the manhattan distance between two vectors", () => {
            const p1 = new day20.Vector(2,1,0)
            const p2 = new day20.Vector(3,3,3)
            chai.expect(p1.manhattanDistance(p2)).to.eql(6)
        })

        it("should correctly calculate a resulting vector from addition", () => {
            const p1 = new day20.Vector(1,2,3)
            const v1 = new day20.Vector(3,3,3)
            const p2 = p1.add(v1)
            chai.expect(p2).to.be.instanceOf(day20.Vector)
            chai.expect(p2).to.not.equal(p1)
            chai.expect(p2).to.not.equal(v1)
            chai.expect(p2).to.have.property("x", 4)
            chai.expect(p2).to.have.property("y", 5)
            chai.expect(p2).to.have.property("z", 6)
        })

        it("should correctly calculate a resulting vector from scaling", () => {
            const v1 = new day20.Vector(1,1,1)
            const v2 = v1.scale(2)
            chai.expect(v2).to.be.instanceOf(day20.Vector)
            chai.expect(v2).to.not.equal(v1)
            chai.expect(v2).to.have.property("x", 2)
            chai.expect(v2).to.have.property("y", 2)
            chai.expect(v2).to.have.property("z", 2)
        })

        it("should correctly calculate vector equality", () => {
            const p1 = new day20.Vector(2,2,2)
            chai.expect(p1.equal(new day20.Vector(2,2,2))).to.be.true
            chai.expect(p1.equal(new day20.Vector(1,2,2))).to.be.false
            chai.expect(p1.equal(new day20.Vector(2,1,2))).to.be.false
            chai.expect(p1.equal(new day20.Vector(2,2,1))).to.be.false
        })
    })

    describe("particle", () => {
        const parser = new day20.Parser()

        describe("positionAfter", () => {
            const examples = [
                {
                    particle: "p=<1,0,0>, v=< 1,0,0>, a=< 1,0,0>",
                    after: 2,
                    pos: "<6,0,0>"
                },
                {
                    particle: "p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>",
                    after: 2,
                    pos: "<0,0,0>"
                },
                {
                    particle: "p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>",
                    after: 2,
                    pos: "<0,0,0>"
                },
                {
                    particle: "p=<3,0,0>, v=< 1,0,0>, a=< 1,0,0>",
                    after: 2,
                    pos: "<8,0,0>"
                },
                {
                    particle: "p=<1,0,0>, v=< 2,0,0>, a=< 1,0,0>",
                    after: 2,
                    pos: "<8,0,0>"
                },
                {
                    particle: "p=<1,0,0>, v=< 1,0,0>, a=< 1,0,0>",
                    after: 2,
                    pos: "<6,0,0>"
                },
                {
                    particle: "p=<1,0,0>, v=< 1,0,0>, a=< 1,0,0>",
                    after: 5,
                    pos: "<21,0,0>"
                },
                {
                    particle: "p=<1,0,0>, v=< 1,0,0>, a=< 1,0,0>",
                    after: 2,
                    pos: "<6,0,0>"
                }
            ]

            examples.forEach(example => {
                it(`should calculate the position of '${example.particle}' after ${example.after} steps as ${example.pos}`, () => {
                    const p = parser.parseParticle(1, example.particle)
                    const pos = p.positionAfter(example.after)
                    chai.expect(pos.toString()).to.eql(example.pos)
                })
            })
        })

        describe("collides", () => {
            const examples = [
                {
                    name: "the same position",
                    p1: "p=<-6,0,0>, v=< 0,0,0>, a=< 0,0,0>",
                    p2: "p=<-6,0,0>, v=< 0,0,0>, a=< 0,0,0>",
                    roots: [0],
                    valid: true
                },
                {
                    name: "integer roots with no acceleration",
                    p1: "p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>", // <-6,0,0> => <-3,0,0> => <0,0,0>
                    p2: "p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>", // <-4,0,0> => <-2,0,0> => <0,0,0>
                    roots: [2],
                    valid: true
                },{
                    name: "real roots with no acceleration",
                    p1: "p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>", // <-6,0,0> => <-3,0,0> -> <-1.5,0,0> -> <0,0,0>
                    p2: "p=< 0,0,0>, v=<-1,0,0>, a=< 0,0,0>", // <0,0,0> => <-1,0,0> -> <-1.5,0,0> -> <-2,0,0>
                    roots: [1.5],
                    valid: false
                },{
                    name: "integer roots with no acceleration delta",
                    p1: "p=<1,0,0>, v=< 2,0,0>, a=< 1,0,0>", // <1,0,0> => <4,0,0> => <8,0,0>
                    p2: "p=<3,0,0>, v=< 1,0,0>, a=< 1,0,0>", // <3,0,0> => <5,0,0> => <8,0,0>
                    roots: [2],
                    valid: true
                },{
                    name: "integer roots with an acceleration delta",
                    p1: "p=<1,0,0>, v=< 1,0,0>, a=< 1,0,0>", // <1,0,0> => <3,0,0> => <6,0,0>
                    p2: "p=<4,0,0>, v=< 1,0,0>, a=< 0,0,0>", // <4,0,0> => <5,0,0> => <6,0,0>
                    roots: [2],
                    valid: true
                },{
                    name: "integer roots with an acceleration and velocity delta",
                    p1: "p=<1,0,0>, v=< 1,0,0>, a=< 1,0,0>", // <1,0,0> => <3,0,0> => <6,0,0>
                    p2: "p=<6,0,0>, v=< 0,0,0>, a=< 0,0,0>", // <6,0,0> => <6,0,0> => <6,0,0>
                    roots: [2],
                    valid: true
                }
            ]

            examples.forEach(example => {
                it(`should identify ${example.name}`, () => {
                    const p1 = parser.parseParticle(0, example.p1)
                    const p2 = parser.parseParticle(1, example.p2)

                    const collisions = p1.collides(p2).filter(x => x >= 0)
                    chai.expect(collisions).to.eql(example.roots)
                    chai.expect(!!collisions.filter(x => Math.floor(x) === x).length).to.eql(example.valid)
                })
            })
        })

        describe("next", () => {
            it("should advance by one step by default", () => {
                const p = parser.parseParticle(0, "p=<1,0,0>, v=<1,0,0>, a=<1,0,0>")
                p.next()
                chai.expect(p.toString()).to.eql("p=<3,0,0>, v=<2,0,0>, a=<1,0,0>")
            })

            it("should allow you to advance more than one step at a time", () => {
                const p = parser.parseParticle(0, "p=<1,0,0>, v=<1,0,0>, a=<1,0,0>")
                p.next(2)
                chai.expect(p.toString()).to.eql("p=<6,0,0>, v=<3,0,0>, a=<1,0,0>")
            })

            describe("advances consistently", () => {
                const examples = [
                    "p=<1,0,0>, v=<1,0,0>, a=<1,0,0>",
                    "p=<2593,6949,1416>, v=<-29,-46,-37>, a=<-2,-7,0>",
                    "p=<5713,562,-2826>, v=<-85,-15,-68>, a=<-3,0,7>",
                    "p=<1933,-993,-2301>, v=<-191,0,42>, a=<8,2,2>",
                    "p=<-3945,-1229,1519>, v=<101,104,4>, a=<17,-3,-12>"
                ]

                const sampleRates = [
                    2,
                    50,
                    100,
                    500,
                    1000
                ]

                examples.forEach(example => {
                    describe(`for '${example}'`, () => {
                        const p1 = parser.parseParticle(0, example)
                        new Array(1000).fill(0).forEach(() => {
                            p1.next()
                        })

                        sampleRates.forEach(rate => {
                            it(`using ${rate} steps at a time`, () => {
                                const p2 = parser.parseParticle(1, example)
                                for(let i = 0; i < 1000; i += rate)
                                    p2.next(rate)

                                chai.expect(p2.toString()).to.eql(p1.toString())
                            })
                        })
                    })
                })
            })
        })
    })

    describe("particleField", () => {
        const parser = new day20.Parser()
        describe("findCollisions", () => {
            const examples = [
                {
                    steps: 0,
                    collisions: []
                },
                {
                    steps: 2,
                    collisions: [0,1,2]
                },
            ]

            examples.forEach(example => {
                it(`should find ${example.collisions.length} collisions after ${example.steps} steps`, () => {
                    const pf = parser.parseParticleField(exampleText2)

                    pf.next(example.steps)
                    const collisions = pf.findCollisions()
                    chai.expect(collisions).to.have.length(example.collisions.length)
                    chai.expect(collisions.map(c => c.id)).to.eql(example.collisions)
                })
            })
        })

        describe("findCollisionSteps", () => {
            it("should find the collision steps for the example", () => {
                const pf = parser.parseParticleField(exampleText2)
                chai.expect(pf.findCollisionSteps()).to.eql([2])
            })
        })
    })

    describe("part1", () => {
        const parser = new day20.Parser()
        const pf = parser.parseParticleField(exampleText1)
        const center = new day20.Vector(0,0,0)

        it("should start out with the right distances", () =>{
            const nearest = pf.nearest(center)
            chai.expect(nearest).to.have.property("id", 0)
            chai.expect(nearest.p.manhattanDistance(center)).to.eql(3)
        })

        it("should iterate to the next set of distances (1)", () => {
            pf.next()
            const nearest = pf.nearest(center)
            chai.expect(nearest).to.have.property("id", 1)
            chai.expect(nearest.p.manhattanDistance(center)).to.eql(2)
        })

        it("should iterate to the next set of distances (2)", () => {
            pf.next()
            const nearest = pf.nearest(center)
            chai.expect(nearest).to.have.property("id", 1)
            chai.expect(nearest.p.manhattanDistance(center)).to.eql(2)
        })

        it("should iterate to the next set of distances (3)", () => {
            pf.next()
            const nearest = pf.nearest(center)
            chai.expect(nearest).to.have.property("id", 0)
            chai.expect(nearest.p.manhattanDistance(center)).to.eql(3)
        })

        it("should return the best after a very long time", () => {
            pf.next(100000)
            const nearest = pf.nearest(center)
            chai.expect(nearest).to.have.property("id", 0)
        })
    })

    describe("part2", () => {
        const parser = new day20.Parser()
        const pf = parser.parseParticleField(exampleText2)

        it("should start out with 4 particles and no collisions", () => {
            chai.expect(pf.particles).to.have.length(4)
            chai.expect(pf.findCollisions()).to.be.empty
        })

        it("should identify that the first collision occurs in 2 steps", () => {
            chai.expect(pf.findCollisionSteps()).to.eql([2])
        })

        it("should find no collisions for the first step", () => {
            pf.next()
            chai.expect(pf.findCollisions()).to.be.empty
        })
        
        it("should find a collision for the second step", () => {
            pf.next()
            const collisions = pf.findCollisions()
            chai.expect(collisions).to.be.have.length(3)
            pf.remove(...collisions)
            chai.expect(pf.particles).to.have.length(1)
            chai.expect(pf.particles[0]).to.have.property("id", 3)
        })

        it("should identify that no further collisions occur", () => {
            chai.expect(pf.findCollisionSteps()).to.be.false
        })
    })
})