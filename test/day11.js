const chai = require("chai")
const day11 = require("../day11")
const fs = require("fs")

describe.only("day11", () => {
    describe("part1", () => {
        describe("example", () => {
            const examples = {
                "ne,ne,ne": ["ne", "ne", "ne"],
                "ne,ne,sw,sw": [],
                "ne,ne,s,s": ["se", "se"],
                "se,sw,se,sw,sw": ["s", "s", "sw"]
            }

            Object.keys(examples).forEach(example => {
                it(`${example} should require ${examples[example]} steps`, () => {
                    chai.expect(day11.steps(example.split(","))).to.eql(examples[example])
                })
            })
        })

        describe("problem", () => {
            it("should calculate the solution", () => {
                const input = fs.readFileSync("data/day11.txt", "utf8").trim().split(",")
                const path = day11.steps(input)
                console.log(`Total steps for shortest path: ${path.length}`)
            })
        })
    })

    describe("part2", () => {
        describe("example", () => {
            const examples = {
                "ne,ne,ne": 3,
                "ne,ne,sw,sw": 2,
                "ne,ne,s,s": 2,
                "se,sw,se,sw,sw": 3
            }

            Object.keys(examples).forEach(example => {
                it(`${example} should get ${examples[example]} steps away at most`, () => {
                    chai.expect(day11.maxDistance(example.split(","))).to.eql(examples[example])
                })
            })
        })

        describe("problem", () => {
            it("should calculate the solution", () => {
                const input = fs.readFileSync("data/day11.txt", "utf8").trim().split(",")
                const maxDist = day11.maxDistance(input)
                console.log(`Maximum distance: ${maxDist}`)
            })
        })
    })
})