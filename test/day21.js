const chai = require("chai")
const day21 = require("../day21")
const fs = require("fs")

describe("day21", () => {
    describe("PixelImage", () => {
        const pixels = [
            [0,1,0],
            [0,0,1],
            [1,1,1]
        ]
        
        it("should be created from a number of pixels", () => {
            const image = new day21.PixelImage(pixels)
            chai.expect(image.pixels).to.eql(pixels)
        })

        it("should throw an error if the image is not square", () => {
            chai.expect(() => new day21.PixelImage([[1], [1,0]])).to.throw
        })

        it("should report the correct size", () => {
            const image = new day21.PixelImage(pixels)
            chai.expect(image).to.have.property("size", 3)
        })

        describe("equals", () => {
            const image = new day21.PixelImage(pixels)
            it("should return false for a null image", () => {
                chai.expect(image.equal(null)).to.be.false
            })

            it("should return false if the image sizes don't match", () => {
                chai.expect(image.equal(new day21.PixelImage([]))).to.be.false
            })

            it("should correctly compare equality", () => {
                chai.expect(image.equal(image)).to.be.true
                chai.expect(image.equal(new day21.PixelImage(pixels))).to.be.true
            })

            it("should correctly identify inequality", () => {
                const pixels = [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
                chai.expect(image.equal(new day21.PixelImage(pixels))).to.be.false
            })
        })

        describe("flipX", () => {
            const image = new day21.PixelImage(pixels)
            it("should create a new image", () => {
                chai.expect(image.flipX()).to.exist.and.not.equal(image)
            })

            it("should flip the horizontal pixels", () => {
                const flipped = [
                    [0,1,0],
                    [1,0,0],
                    [1,1,1]
                ]
                chai.expect(image.flipX().pixels).to.eql(flipped)
            })
        })

        describe("flipY", () => {
            const image = new day21.PixelImage(pixels)
            it("should create a new image", () => {
                chai.expect(image.flipY()).to.exist.and.not.equal(image)
            })

            it("should flip the vertical pixels", () => {
                const flipped = [
                    [1,1,1],
                    [0,0,1],
                    [0,1,0]
                ]
                chai.expect(image.flipY().pixels).to.eql(flipped)
            })
        })

        describe("transpose", () => {
            const image = new day21.PixelImage(pixels)
            it("should create a new image", () => {
                chai.expect(image.transpose()).to.exist.and.not.equal(image)
            })

            it("should flip rows with columns", () => {
                const flipped = [
                    [0,0,1],
                    [1,0,1],
                    [0,1,1]
                ]
                chai.expect(image.transpose().pixels).to.eql(flipped)
            })
        })
        
        describe("rotateCW", () => {
            const image = new day21.PixelImage(pixels)
            it("should create a new image", () => {
                chai.expect(image.rotateCW()).to.exist.and.not.equal(image)
            })

            it("should rotate the columns clockwise", () => {
                const flipped = [
                    [1,0,0],
                    [1,0,1],
                    [1,1,0]
                ]
                chai.expect(image.rotateCW().pixels).to.eql(flipped)
            })
        })
        
        describe("rotateCCW", () => {
            const image = new day21.PixelImage(pixels)
            it("should create a new image", () => {
                chai.expect(image.rotateCCW()).to.exist.and.not.equal(image)
            })

            it("should rotate the columns counter-clockwise", () => {
                const flipped = [
                    [0,1,1],
                    [1,0,1],
                    [0,0,1]
                ]
                chai.expect(image.rotateCCW().pixels).to.eql(flipped)
            })
        })

        describe("toString", () => {
            const image = new day21.PixelImage(pixels)
            it("should represent the image as a string", () => {
                const expected = [
                    ".#.",
                    "..#",
                    "###"
                ].join("\n")
                chai.expect(image.toString()).to.eql(expected)
            })
        })

        describe("slice", () => {
            const image = new day21.PixelImage(pixels)

            it("should create a copy of the image by default", () => {
                chai.expect(image.slice()).to.be.instanceOf(day21.PixelImage)
                chai.expect(image.slice().equal(image)).to.be.true
            })

            it("should allow you to take the NW quadrant", () => {
                chai.expect(image.slice(0, 0, 2, 2)).to.have.property("pixels").eql([
                    [0,1],
                    [0,0]
                ])
            })

            it("should allow you to take the NE quadrant", () => {
                chai.expect(image.slice(1, 0, 3, 2)).to.have.property("pixels").eql([
                    [1,0],
                    [0,1]
                ])
            })

            it("should allow you to take the SW quadrant", () => {
                chai.expect(image.slice(0, 1, 2, 3)).to.have.property("pixels").eql([
                    [0,0],
                    [1,1]
                ])
            })

            it("should allow you to take the SE quadrant", () => {
                chai.expect(image.slice(1, 1, 3, 3)).to.have.property("pixels").eql([
                    [0,1],
                    [1,1]
                ])
            })
        })
    })

    describe("ImageParser", () => {
        const parser = new day21.ImageParser()

        describe("parsePixel", () => {
            it("should parse an off pixel", () => {
                chai.expect(parser.parsePixel(".")).to.eql(0)
            })

            it("should parse an on pixel", () => {
                chai.expect(parser.parsePixel("#")).to.eql(1)
            })

            it("should parse an unknown pixel", () => {
                chai.expect(parser.parsePixel(" ")).to.be.undefined
                chai.expect(parser.parsePixel("1")).to.be.undefined
            })
        })

        describe("parseLine", () => {
            it("should parse the valid pixels", () => {
                chai.expect(parser.parseLine("..#")).to.eql([0,0,1])
            })

            it("should ignore invalid pixels", () => {
                chai.expect(parser.parseLine("  ..#  ")).to.eql([0,0,1])
            })
        })

        describe("parseImage", () => {
            const lines = [
                ".#.",
                "..#",
                "###"
            ]

            it("should return an image", () => {
                chai.expect(parser.parseImage(lines)).to.be.instanceOf(day21.PixelImage)
            })

            it("should parse the correct image", () => {
                const expected = new day21.PixelImage([
                    [0,1,0],
                    [0,0,1],
                    [1,1,1]
                ])
                chai.expect(parser.parseImage(lines).toString()).to.eql(expected.toString())
            })
        })
    })

    describe("RulePattern", () => {
        const image = new day21.PixelImage([
            [0,1,0],
            [0,0,1],
            [1,1,1]
        ])

        const pattern = new day21.RulePattern(image)

        it("should match the normal image", () => {
            chai.expect(pattern.matches(image)).to.be.true
        })

        it("should match an image that has been flipped vertically", () => {
            chai.expect(pattern.matches(image.flipY())).to.be.true
        })

        it("should match an image that has been flipped horizontally", () => {
            chai.expect(pattern.matches(image.flipX())).to.be.true
        })

        it("should match an image that has been rotated clockwise", () => {
            chai.expect(pattern.matches(image.rotateCW())).to.be.true
        })

        it("should match an image that has been rotated counter-clockwise", () => {
            chai.expect(pattern.matches(image.rotateCCW())).to.be.true
        })

        it("should match an image that has been rotated 180 degrees", () => {
            chai.expect(pattern.matches(image.rotateCW().rotateCW())).to.be.true
        })
    })

    describe("RuleParserMultiline", () => {
        const parser = new day21.RuleParserMultiline()

        const examples = [
            {
                pattern: "../.#",
                replacement: "..\n.#",
                lines: [
                    "../.#  =  ..",
                    "          .#"
                ]
            },
            {
                pattern: ".#./..#/###",
                replacement: ".#.\n..#\n###",
                lines: [
                    "                .#.",
                    ".#./..#/###  =  ..#",
                    "                ###"
                ]
            },
            {
                pattern: "#..#/..../#..#/.##.",
                replacement: "#..#\n....\n#..#\n.##.",
                lines: [
                    "                        #..#",
                    "#..#/..../#..#/.##.  =  ....",
                    "                        #..#",
                    "                        .##."
                ]
            }
        ]

        describe("parseRulePattern", () => {
            it("should return a RulePattern object", () => {
                chai.expect(parser.parseRulePattern(".")).to.be.instanceOf(day21.RulePattern)
            })

            describe("should properly process the rule pattern image", () => {
                examples.forEach(example => {
                    it(`should parse '${example.pattern}' correctly`, () => {
                        const rule = parser.parseRulePattern(example.pattern)
                        chai.expect(rule).to.exist
                        chai.expect(rule.toString()).to.eql(example.pattern)
                    })
                })
            })
        })

        describe("parseRule", () => {

            it("should return a Rule object", () => {
                chai.expect(parser.parseRule([". = ."])).to.be.instanceOf(day21.Rule)
            })

            describe("should properly process the rule definition", () => {
                
                examples.forEach((example, i) => {
                    it(`should parse example ${i + 1} correctly`, () => {
                        const rule = parser.parseRule(example.lines)
                        chai.expect(rule.pattern.toString()).to.eql(example.pattern)
                        chai.expect(rule.replacement.toString()).to.eql(example.replacement)
                    })
                })
            })
        })

        describe("parseRules", () => {
            const exampleText = fs.readFileSync("data/day21erm.txt", "utf8")
            it("should parse the rules correctly", () => {
                const rules = parser.parseRules(exampleText)
                chai.expect(rules).to.have.length(examples.length)

                examples.forEach((example, i) => {
                    const rule = rules[i]
                    chai.expect(rule.pattern.toString()).to.eql(example.pattern)
                    chai.expect(rule.replacement.toString()).to.eql(example.replacement)
                })
            })
        })
    })

    
    describe("RuleParserSingleLine", () => {
        const parser = new day21.RuleParserSingleLine()

        const examples = [
            "../.# => ##./#../...",
            ".#./..#/### => #..#/..../..../#..#"
        ]

        describe("parseRulePattern", () => {
            it("should return a RulePattern object", () => {
                chai.expect(parser.parseRulePattern(".")).to.be.instanceOf(day21.RulePattern)
            })

            describe("should properly process the rule pattern image", () => {
                examples.forEach(example => {
                    const pattern = example.split("=>")[0].trim()
                    it(`should parse '${pattern}' correctly`, () => {
                        const rule = parser.parseRulePattern(pattern)
                        chai.expect(rule).to.exist
                        chai.expect(rule.toString()).to.eql(pattern)
                    })
                })
            })
        })

        describe("parseRule", () => {

            it("should return a Rule object", () => {
                chai.expect(parser.parseRule(". => .")).to.be.instanceOf(day21.Rule)
            })

            describe("should properly process the rule definition", () => {
                
                examples.forEach((example, i) => {
                    it(`should parse example ${i + 1} correctly`, () => {
                        const rule = parser.parseRule(example)
                        chai.expect(rule.toString()).to.eql(example)
                    })
                })
            })
        })

        describe("parseRules", () => {
            const exampleText = fs.readFileSync("data/day21er.txt", "utf8")
            it("should parse the rules correctly", () => {
                const rules = parser.parseRules(exampleText)
                chai.expect(rules).to.have.length(examples.length)

                examples.forEach((example, i) => {
                    const rule = rules[i]
                    chai.expect(rule.toString()).to.eql(example)
                })
            })
        })
    })

    describe("Enhancer", () => {
        const exampleImageText = fs.readFileSync("data/day21e.txt", "utf8")
        const image = new day21.ImageParser().parseImage(exampleImageText.split("\n"))

        const exampleRulesText = fs.readFileSync("data/day21er.txt", "utf8")
        const rules = new day21.RuleParserSingleLine().parseRules(exampleRulesText)

        const enhancer = new day21.Enhancer(rules)

        describe("enhance", () => {
            let enhanced = image
            it("should throw an error if the image is not a valid size", () => {
                chai.expect(() => enhancer.enhance(new day21.PixelImage([[0]]))).to.throw
            })

            it("should expand the image into the 2nd rule's replacement", () => {
                enhanced = enhancer.enhance(enhanced)
                chai.expect(enhanced).to.exist.and.be.instanceOf(day21.PixelImage)
                chai.expect(enhanced).to.have.property("size", 4)
                chai.expect(enhanced.equal(rules[1].replacement))
            })

            it("should then expand into 4 of the 1st rules", () => {
                enhanced = enhancer.enhance(enhanced)
                chai.expect(enhanced).to.have.property("size", 6)
                chai.expect(enhanced.slice(0,0,3,3).equal(rules[0].replacement))
                chai.expect(enhanced.slice(0,3,3,6).equal(rules[0].replacement))
                chai.expect(enhanced.slice(3,0,6,3).equal(rules[0].replacement))
                chai.expect(enhanced.slice(3,3,6,6).equal(rules[0].replacement))
            })
        })
    })

    describe("part1", () => {
        it("should calculate the correct number of on pixels after 2 iterations", () => {
            const exampleImageText = fs.readFileSync("data/day21e.txt", "utf8")
            const image = new day21.ImageParser().parseImage(exampleImageText.split("\n"))
    
            const exampleRulesText = fs.readFileSync("data/day21er.txt", "utf8")
            const rules = new day21.RuleParserSingleLine().parseRules(exampleRulesText)
    
            const enhancer = new day21.Enhancer(rules)

            let enhanced = image
            for (let i = 0; i < 2; i++)
                enhanced = enhancer.enhance(enhanced)

            const onPixels = enhanced.pixels.reduce((sum, row) => {
                return sum + row.reduce((sum, px) => sum + (px ? 1 : 0), 0)
            }, 0)
            chai.expect(onPixels).to.eql(12)
        })
    })
})