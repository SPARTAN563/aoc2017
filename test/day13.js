const chai = require("chai")
const day13 = require("../day13")

describe("day13", () => {
    describe("parser", () => {
        it("should extract the correct values", () => {
            const parser = new day13.Parser("data/day13e.txt")
            chai.expect(parser.next()).to.exist.and.have.property("depth", 0)
            chai.expect(parser.next()).to.exist.and.have.property("depth", 1)
            chai.expect(parser.next()).to.exist.and.have.property("depth", 4)
            chai.expect(parser.next()).to.exist.and.have.property("depth", 6)
            chai.expect(parser.next()).to.not.exist
        })
    })

    describe("layerBuilder", () => {
        it("should build the correct layers", () => {
            const parser = new day13.Parser("data/day13e.txt")
            const layers = day13.buildLayers(parser)

            chai.expect(layers).to.have.length(4)
            chai.expect(layers[0]).to.have.property("depth", 0)
            chai.expect(layers[3]).to.have.property("depth", 6)
        })
    })

    describe("severity", () => {
        const parser = new day13.Parser("data/day13e.txt")
        const layers = day13.buildLayers(parser)
        
        it("should calculate the correct severity for the example", () => {
            const severity = day13.severity(layers)
            chai.expect(severity).to.eql(24)
        })

        it("should calculate the severity with a delay", () => {
            const severity = day13.severity(layers, 10)
            chai.expect(severity).to.eql(0)
        })
    })

    describe("stealthDelay", () => {
        it("should calculate the number of picoseconds to delay to evade detection", () => {
            const parser = new day13.Parser("data/day13e.txt")
            const layers = day13.buildLayers(parser)

            const delay = day13.stealthDelay(layers)
            chai.expect(delay).to.eql(10)
        })
    })
})