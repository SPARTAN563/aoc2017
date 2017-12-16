const chai = require("chai")
const day16 = require("../day16")

describe("day16", () => {
    describe("part 1", () => {
        describe("spin", () => {
            it("should spin 1 correctly", () => {
                chai.expect(day16.dance(["s1"], "abcde")).to.eql("eabcd")
            })
            
            it("should spin 4 correctly", () => {
                chai.expect(day16.dance(["s4"], "abcde")).to.eql("bcdea")
            })
        })

        describe("exchange", () => {
            it("should exchange ends correctly", () => {
                chai.expect(day16.dance(["x0/4"], "abcde")).to.eql("ebcda")
            })

            it("should exchange the last two correctly", () => {
                chai.expect(day16.dance(["x3/4"], "abcde")).to.eql("abced")
            })
        })

        describe("partner", () => {
            it("should exchange characters correctly", () => {
                chai.expect(day16.dance(["pa/e"], "abcde")).to.eql("ebcda")
            })

            it("should exchange characters correctly", () => {
                chai.expect(day16.dance(["pd/e"], "abcde")).to.eql("abced")
            })
        })
    })

    describe("part2", () => {
        it("should calculate the spin for the 2nd dance", () => {
            chai.expect(day16.dance(["s1"], "abcde")).to.eql("eabcd")
            chai.expect(day16.dance(["s1"], "baedc")).to.eql("cbaed")
        })

        
        it("should calculate the whole second dance", () => {
            chai.expect(day16.dance(["s1", "x3/4", "pe/b"], "abcde")).to.eql("baedc")
            chai.expect(day16.dance(["s1", "x3/4", "pe/b"], "baedc")).to.eql("ceadb")
        })
    })
})