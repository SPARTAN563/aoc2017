const chai = require("chai")
const validate = require("../day4")
const fs = require("fs")

describe("day4", () => {
    describe("part1", () => {
        const cases = {
            "aa bb cc dd ee": true,
            "aa bb cc dd aa": false,
            "aa bb cc dd aaa": true
        }

        Object.keys(cases).forEach((c) => {
            it(`should mark '${c}' as ${cases[c] ? 'valid': 'invalid'}`, () => {
                chai.expect(validate(c)).to.eql(cases[c])
            })
        })
    })

    describe("part2", () => {
        const cases = {
            "abcde fghij": true,
            "abcde xyz ecdab": false,
            "a ab abc abd abf abj": true,
            "iiii oiii ooii oooi oooo": true
        }

        const transform = x => Array.prototype.slice.call(x).sort().join("")

        Object.keys(cases).forEach((c) => {
            it(`should mark '${c}' as ${cases[c] ? 'valid': 'invalid'}`, () => {
                chai.expect(validate(c, transform)).to.eql(cases[c])
            })
        })
    })
})