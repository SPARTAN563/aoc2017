const chai = require("chai")
const day17 = require("../day17")

describe("day17", () => {
    describe("part1", () => {
        const spinlock = new day17.Spinlock()

        it("should start with the buffer [0]", () => {
            chai.expect(spinlock.buffer()).to.eql([0])
        })

        it("should then insert 1", () => {
            spinlock.next(3)
            chai.expect(spinlock.buffer()).to.eql([0, 1])

            chai.expect(spinlock.getRoot()).to.eql(0)
            chai.expect(spinlock.getRootNext()).to.eql(1)
            chai.expect(spinlock.getCurrent()).to.eql(1)
            chai.expect(spinlock.getNext()).to.eql(0)
        })

        it("should then insert 2 between the values", () => {
            spinlock.next(3)
            chai.expect(spinlock.buffer()).to.eql([0, 2, 1])

            chai.expect(spinlock.getRoot()).to.eql(0)
            chai.expect(spinlock.getRootNext()).to.eql(2)
        })

        it("should continue until we have 9 values", () => {
            while(spinlock.max() < 9)
                spinlock.next(3)

            chai.expect(spinlock.buffer()).to.eql([0, 9, 5, 7, 2, 4, 3, 8, 6, 1])
        })

        it("should eventually have 2017 values in it", () => {
            while(spinlock.max() < 2017)
                spinlock.next(3)

            chai.expect(spinlock.getCurrent()).to.eql(2017)
        })

        it("should have the correct section around the current index", () => {
            const section = spinlock.slice(-3, 3)
            chai.expect(section).to.eql([1512, 1134, 151, 2017, 638, 1513, 851])
        })

        it("should have the next value 638", () => {
            chai.expect(spinlock.getNext()).to.eql(638)
        })

        describe("Predictive", () => {
            let predictive = new day17.SpinlockPredictive()
            
            before(() => predictive = new day17.SpinlockPredictive([0,1,spinlock.indexOf(2017), spinlock.indexOf(2017)+1]))

            it("should be tracking 4 indices", () => {
                chai.expect(Object.keys(predictive.tracked)).to.have.length(4)
            })

            it("should fill the first 2017 entities", () => {
                while(predictive.max() < 2017)
                    predictive.next(3)
            })

            it("should have populated its tracked 0 index", () => {
                chai.expect(predictive.get(0)).to.eql(spinlock.get(0))
            })

            it("should have updated its tracked 1 index", () => {
                chai.expect(predictive.get(1)).to.eql(spinlock.get(1))
            })

            it("should have updated its tracked current index", () => {
                chai.expect(predictive.get(spinlock.index)).to.eql(2017)
            })
            
            it("should have invalidated its tracked next index", () => {
                chai.expect(predictive.get(spinlock.index + 1)).to.eql(undefined)
            })
        })
    })
})