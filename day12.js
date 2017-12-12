const fs = require("fs")

/**
 * @typedef ParsedNode
 * @prop {string} id The unique ID of the node
 * @prop {Array<string>} children The IDs of this node's children
 */

/**
 * Provides functionality for parsing a structured source file
 * @param {string} source The source file from which to parse 
 */
function Parser(source) {
    this.lines = fs.readFileSync(source, "utf8").split("\n").map(l => l.trim());
    this.re = /^(\d+)\s<->\s((?:\d+,\s)*\d+)$/;
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
        id: parseInt(match[1]),
        children: (match[2] || "").split(", ").map(x => parseInt(x.trim())).filter(x => !!x)
    }
}

Parser.prototype.skip = function(n) {
    for(let i = 0; i < n; i++)
        this.lines.shift()
}

exports.Parser = Parser;

exports.group = function group(parser) {
    let groups = []

    let x = null;
    while(x = parser.next()) {
        const matchingGroups = groups.filter(group => group.has(x.id) || x.children.some(y => group.has(y)))
        const combinedSet = new Set()
        matchingGroups.forEach(group => group.forEach(y => combinedSet.add(y)))
        combinedSet.add(x.id)
        x.children.forEach(child => combinedSet.add(child))
        groups = [].concat(
            groups.filter(group => !~matchingGroups.indexOf(group)),
            [combinedSet]
        )
    }

    return groups
}