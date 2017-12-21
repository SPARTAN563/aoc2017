/**
 * @typedef Pixel
 * @type {number}
 */

class PixelImage {
    /**
     * 
     * @param {Array<Array<Pixel>>} pixels 
     */
    constructor(pixels) {
        this.pixels = pixels

        if (!this.pixels.every(row => row.length === this.pixels.length))
            throw new Error(`Image is not square, got '${pixels}'`)
    }

    get size() {
        return this.pixels.length
    }

    /**
     * Gets the pixel at a specific index
     * @param {number} x 
     * @param {number} y 
     * @return {Pixel}
     */
    get(x, y) {
        if (x >= this.size || y >= this.size) throw new Error(`Image is not large enough to gather pixel (${x}, ${y})`)
        return this.pixels[y, x]
    }

    /**
     * @return {PixelImage}
     */
    flipX() {
        return new PixelImage(this.pixels.map(line => line.slice().reverse()))
    }

    /**
     * @return {PixelImage}
     */
    flipY() {
        return new PixelImage(this.pixels.slice().reverse())
    }

    /**
     * @return {PixelImage}
     */
    transpose() {
        let transposed = this.pixels.map(row => row.map(_ => 0))
        for(let i = 0; i < this.size; i++)
            for(let j = 0; j < this.size; j++)
                transposed[i][j] = this.pixels[j][i]
        
        return new PixelImage(transposed)
    }

    /**
     * @return {PixelImage}
     */
    rotateCW() {
        return this.transpose().flipX()
    }
    
    /**
     * @return {PixelImage}
     */
    rotateCCW() {
        return this.transpose().flipY()
    }

    /**
     * 
     * @param {PixelImage} image 
     * @return {boolean}
     */
    equal(image) {
        if (!image) return false
        if (image.size !== this.size) return false

        for(let i = 0; i < image.size; i++)
            for(let j = 0; j < image.size; j++)
                if (image.pixels[i][j] !== this.pixels[i][j]) return false

        return true
    }

    /**
     * Creates a new image which is composed of a sub-slice of this image
     * @param {number} startX 
     * @param {number} startY 
     * @param {number} endX 
     * @param {number} endY 
     */
    slice(startX=0, startY=0, endX=this.size, endY=this.size) {
        const output = new Array(endY - startY).fill(0).map(_ => new Array(endX - startX).fill(0))

        for(let x = startX; x < endX; x++)
            for(let y = startY; y < endY; y++)
                output[y - startY][x - startX] = this.pixels[y][x]

        return new PixelImage(output)
    }

    toString(separator="\n") {
        return this.pixels.map(row => row.map(p => p === 1 ? "#" : p === 0 ? "." : " ").join("")).join(separator)
    }
}
exports.PixelImage = PixelImage

/**
 * 
 */
class ImageParser {
    constructor() {

    }

    /**
     * 
     * @param {string} pixel 
     * @returns {Pixel}
     */
    parsePixel(pixel) {
        switch(pixel) {
            case ".": return 0
            case "#": return 1
            default: return undefined
        }
    }

    /**
     * 
     * @param {string} line 
     * @returns {Array<Pixel>}
     */
    parseLine(line) {
        return line.split("").map(pixel => this.parsePixel(pixel)).filter(x => x !== undefined)
    }

    /**
     * 
     * @param {Array<string>} image 
     * @returns {PixelImage}
     */
    parseImage(image) {
        return new PixelImage(image.map(line => this.parseLine(line)).filter(x => !!x.length))
    }
}
exports.ImageParser = ImageParser

class RulePattern {
    /**
     * 
     * @param {PixelImage} pattern 
     */
    constructor(pattern) {
        this.pattern = pattern
    }

    /**
     * 
     * @param {PixelImage} image 
     */
    matches(image) {
        return [
            () => image,
            () => image.flipX(),
            () => image.rotateCW(),
            () => image.rotateCCW(),
            () => image.rotateCW().rotateCW(),
            () => image.flipX().rotateCW(),
            () => image.flipX().rotateCCW(),
            () => image.flipX().rotateCW().rotateCW()
        ].some(sample => this.pattern.equal(sample()))
    }
    
    toString() {
        return this.pattern.toString("/")
    }
}
exports.RulePattern =RulePattern

class Rule {
    /**
     * 
     * @param {RulePattern} pattern 
     * @param {PixelImage} replacement 
     */
    constructor(pattern, replacement) {
        this.pattern = pattern
        this.replacement = replacement
    }

    toString() {
        return `${this.pattern.toString()} => ${this.replacement.toString("/")}`
    }
}
exports.Rule = Rule

class RuleParserMultiline {
    constructor() {
        this.imageParser = new ImageParser()
    }

    /**
     * 
     * @param {string} pattern 
     * @return {RulePattern}
     */
    parseRulePattern(pattern) {
        return new RulePattern(this.imageParser.parseImage(pattern.split("/")))
    }

    /**
     * 
     * @param {Array<string>} lines 
     * @return {Rule}
     */
    parseRule(lines) {
        const patternLine = lines.find(line => ~line.indexOf("="))
        if (!patternLine) throw new Error("Could not find pattern line in rule lines")

        const patternEndIndex = patternLine.indexOf("=")
        const patternRule = this.parseRulePattern(patternLine.slice(0, patternEndIndex - 1))
        const replacement = this.imageParser.parseImage(lines.map(line => line.slice(patternEndIndex + 1)))

        return new Rule(patternRule, replacement)
    }

    /**
     * 
     * @param {string} rules 
     * @returns {Array<Rule>}
     */
    parseRules(rules) {
        let output = []

        const lines = rules.split("\n")
        let buffer = []

        for (let line = lines.shift(); line; line=lines.shift())
            if (line.trim().length)
                buffer.push(line)
            else {
                const rule = this.parseRule(buffer)
                if (rule) output.push(rule)
                buffer = []
            }

        if (buffer.length) {
            const rule = this.parseRule(buffer)
            if (rule) output.push(rule)
        }

        return output
    }
}
exports.RuleParserMultiline = RuleParserMultiline

class RuleParserSingleLine {
    constructor() {
        this.imageParser = new ImageParser()
    }

    /**
     * 
     * @param {string} pattern 
     * @return {RulePattern}
     */
    parseRulePattern(pattern) {
        return new RulePattern(this.imageParser.parseImage(pattern.split("/")))
    }
    
    /**
     * 
     * @param {string} pattern 
     * @return {PixelImage}
     */
    parseReplacement(pattern) {
        return this.imageParser.parseImage(pattern.split("/"))
    }

    /**
     * 
     * @param {string} line
     * @return {Rule}
     */
    parseRule(line) {
        const parts = line.split("=>")
        if (parts.length !== 2) throw new Error("Could not find the pattern definition in the provided line")
        
        const patternRule = this.parseRulePattern(parts[0])
        const replacement = this.parseReplacement(parts[1])

        return new Rule(patternRule, replacement)
    }

    /**
     * 
     * @param {string} rules 
     * @returns {Array<Rule>}
     */
    parseRules(rules) {
        return rules.split("\n").map(line => this.parseRule(line))
    }
}
exports.RuleParserSingleLine = RuleParserSingleLine

class Enhancer {
    /**
     * 
     * @param {Array<Rule>} rules 
     */
    constructor(rules) {
        this.rules = rules
    }

    /**
     * 
     * @param {PixelImage} pattern 
     */
    transform(pattern) {
        const rule = this.rules.find(rule => rule.pattern.matches(pattern))
        if (!rule) throw new Error(`No replacement pattern for ${pattern.toString("/")}`)
        return rule.replacement
    }

    /**
     * 
     * @param {PixelImage} image 
     * @param {Array<Array<Pixel>>} canvas 
     * @param {number} x 
     * @param {number} y 
     */
    overlay(image, canvas, x, y) {
        for(let i = 0; i < image.size; i++)
            for(let j = 0; j < image.size; j++)
                canvas[y + i][x + j] = image.pixels[i][j]
    }

    /**
     * 
     * @param {PixelImage} image 
     * @returns {PixelImage}
     */
    enhance(image) {
        let splitSize = -1
        if(!(image.size % 2))
            splitSize = 2
        else if(!(image.size % 3))
            splitSize = 3

        if (!~splitSize) throw new Error(`Image size (${image.size}) is not a valid multiple`)
        const splits = image.size / splitSize

        const newSplitSize = splitSize + 1
        const newSize = splits * newSplitSize
        const output = new Array(newSize).fill(0).map(_ => new Array(newSize).fill(undefined))

        for(let i = 0; i < splits; i++) {
            for(let j = 0; j < splits; j++) {
                const source = image.slice(i * splitSize, j * splitSize, (i+1)*splitSize, (j+1)*splitSize)
                try {
                    const replacement = this.transform(source)
                    this.overlay(replacement, output, i*newSplitSize, j*newSplitSize)
                } catch (err) {
                    throw new Error(`Failed to transform ${source.toString("/")} in ${image.toString("/")}`)
                }
            }
        }

        
        return new PixelImage(output)
    }
}
exports.Enhancer = Enhancer