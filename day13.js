const fs = require("fs")

/**
 * @typedef ParsedNode
 * @prop {number} depth The depth of the layer
 * @prop {number} range The range (number of steps involved) in scanning the layer
 */

/**
 * Provides functionality for parsing a structured source file
 * @param {string} source The source file from which to parse 
 */
function Parser(source) {
    this.lines = fs.readFileSync(source, "utf8").split("\n").map(l => l.trim());
    this.re = /^(\d+):\s(\d+)$/;
}

/**
 * Parses the next source file line into a parsed node object
 * @returns {ParsedNode}
 */
Parser.prototype.next = function() {
    if(!this.lines) return null;

    const line = this.lines.shift();
    if(!line) return
    const match = this.re.exec(line);
    if (!match) throw new Error(`Failed to match line '${line}' to regex`);

    return {
        depth: parseInt(match[1]),
        range: parseInt(match[2])
    }
}

Parser.prototype.skip = function(n) {
    for(let i = 0; i < n; i++)
        this.lines.shift()
}

exports.Parser = Parser;

/**
 * Builds the list of IDS layers
 * @param {Parser} parser 
 * @returns {Array<ParsedNode>}
 */
function buildLayers(parser) {
    /** @type {Array<ParsedNode>} */
    const layers = []

    /** @type {ParsedNode} */
    let node = null 
    
    while(node = parser.next())
        layers.push(node)

    return layers.sort((a, b) => a.depth > b.depth ? 1 : -1)
}
exports.buildLayers = buildLayers

/**
 * Calculates the severity of a journey through the IDS layers
 * @param {Array<ParsedNode>} layers 
 */
function severity(layers, delay=0) {
    return layers.reduce((sum, layer) => {
        if ((layer.depth + delay) % (layer.range + layer.range - 2)) return sum

        return sum + (layer.depth * layer.range)
    },0)
}
exports.severity = severity

function stealthDelay(layers, max=10000) {
    for(let i = 0;i < max;i++)
        if(layers.every(layer => (layer.depth + i) % (layer.range * 2 - 2))) return i
    return null
}
exports.stealthDelay = stealthDelay