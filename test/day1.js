const chai = require("chai");
const fs = require("fs");
const captcha = require("../day1");

describe("day1", () => {
    describe("part1", () => {
        it("1122 should produce 3", () => {
            chai.expect(captcha.part1("1122")).to.eql(3)
        })

        it("1111 should produce 4", () => {
            chai.expect(captcha.part1("1111")).to.eql(4)
        })

        it("1234 should produce 0", () => {
            chai.expect(captcha.part1("1234")).to.eql(0)
        })

        it("91212129 should produce 9", () => {
            chai.expect(captcha.part1("91212129")).to.eql(9)
        })

        it("should calculate the result", () => {
            const input = fs.readFileSync("data/day1.txt", "utf8").trim()
            chai.expect(captcha.part1(input)).to.exist
            console.log(`Captcha: ${captcha.part1(input)}`)
        })
    })

    describe("part2", () => {

        it("1212 should produce 6", () => {
            chai.expect(captcha.part2("1212")).to.eql(6)
        })

        it("1221 should produce 0", () => {
            chai.expect(captcha.part2("1221")).to.eql(0)
        })

        it("123425 should produce 4", () => {
            chai.expect(captcha.part2("123425")).to.eql(4)
        })

        it("123123 should produce 12", () => {
            chai.expect(captcha.part2("123123")).to.eql(12)
        })
        
        it("12131415 should produce 12", () => {
            chai.expect(captcha.part2("12131415")).to.eql(4)
        })

        it("should calculate the result", () => {
            const input = fs.readFileSync("data/day1.txt", "utf8").trim()
            console.log(`Captcha: ${captcha.part2(input)}`)
        })
    })
})