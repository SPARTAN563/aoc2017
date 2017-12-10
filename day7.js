const fs = require("fs")

/**
 * @typedef ParsedNode
 * @prop {string} id The unique ID of the node
 * @prop {number} weight The weight of the node
 * @prop {Array<string>} children The IDs of this node's children
 */

/**
 * Provides functionality for parsing a structured source file
 * @param {string} source The source file from which to parse 
 */
function Parser(source) {
    this.lines = fs.readFileSync(source, "utf8").split("\n").map(l => l.trim());
    this.re = /^([a-z]+)\s\((\d+)\)(?:\s->\s([\w\s,]+))?$/;
}

/**
 * Parses the next source file line into a parsed node object
 * @returns {ParsedNode}
 */
Parser.prototype.next = function() {
    if(!this.lines) return null;

    const line = this.lines.shift();
    const match = this.re.exec(line);
    if (!match) return null;

    return {
        id: match[1],
        weight: parseInt(match[2]),
        children: (match[3] || "").split(",").map(x => x.trim()).filter(x => !!x)
    }
}

Parser.prototype.skip = function(n) {
    for(let i = 0; i < n; i++)
        this.lines.shift()
}

exports.Parser = Parser;

/**
 * @typedef TreeNode
 * @property {string} id The unique ID of the tree node
 * @property {number} weight The weight of the tree node
 * @property {Array<TreeNode>} children The child nodes
 */

/**
 * @property {Array<TreeNode>} roots The root nodes of the tree (that don't have parents yet)
 * @property {Map<string, TreeNode>} leaves The mapping of tree nodes to their IDs
 */
function Builder() {
    this.roots = [];
    this.leaves = {};
}

/**
 * 
 * @param {string} id The node ID to retrieve
 * @param {boolean} create Whether to create the node if it doesn't exist
 * @returns {TreeNode}
 */
Builder.prototype.get = function(id, create=false) {
    if (!create && !this.leaves[id]) return;

    const treeNode = this.leaves[id] || {
        id: id,
        weight: NaN,
        children: []
    }

    this.leaves[id] = treeNode

    return treeNode
}

/**
 * 
 * @param {ParsedNode} node The node to attach to the tree 
 */
Builder.prototype.attach = function(node) {
    /**
     * @type TreeNode
     */
    const hadNode = !!this.get(node.id)

    const treeNode = this.get(node.id, true)

    treeNode.weight = node.weight
    treeNode.children = node.children.map(id => this.get(id, true))
    
    if (!hadNode)
        this.roots.push(treeNode)

    this.roots = this.roots.filter(x => !~node.children.indexOf(x.id))
}

exports.Builder = Builder

function Balancer() {
    this.weights = {}
    this.unbalanced = []
}

/**
 * 
 * @param {TreeNode} node 
 */
Balancer.prototype.visit = function(node) {
    let childWeights = node.children.map(child => ({ id: child.id, selfWeight: child.weight, weight: this.visit(child) }))
    let totalWeight = node.weight + childWeights.reduce((sum, child) => sum + child.weight, 0)
    this.weights[node.id] = totalWeight

    if (childWeights.length && !childWeights.every(x => x.weight === childWeights[0].weight))
        this.unbalanced.push({
            id: node.id,
            childWeights: childWeights
        })

    return totalWeight
}

exports.Balancer = Balancer