const fs = require("fs")

function puzzle(name, execute) {
    console.log(`${name}`)

    const input = execute.length && fs.existsSync(`data/${name}.txt`) && fs.readFileSync(`data/${name}.txt`, "utf8").trim()
    execute(input)
    console.log()
}

puzzle("day1", (data) => {
    const day1 = require("./day1")
    console.log(`Part 1 Captcha: ${day1.part1(data)}`)
    console.log(`Part 2 Captcha: ${day1.part2(data)}`)
})

puzzle("day2", (data) => {
    const day2 = require("./day2")
    console.log(`Part 1 Checksum: ${day2.part1(data)}`)
    console.log(`Part 2 Checksum: ${day2.part2(data)}`)
})

puzzle("day3", () => {
    const data = 347991
    const distance = require("./day3p1")
    console.log(`Part 1 Distance: ${distance(data)}`)
    const firstGreater = require("./day3p2")
    console.log(`Part 2 First Greater: ${firstGreater(data)}`)
})

puzzle("day4", (data) => {
    const validate = require("./day4")
    console.log(`Part 1: ${data.split("\n").filter(x => validate(x)).length} valid`)
    
    const transform = x => Array.prototype.slice.call(x).sort().join("")
    console.log(`Part 2: ${data.split("\n").filter(x => validate(x, transform)).length} valid`)
})

puzzle("day5", (data) => {
    const dataArray = data.split("\n").map(x => parseFloat(x.trim()))
    const exitVelocity = require("./day5")
    console.log(`Part 1: Exits in ${exitVelocity(dataArray)} steps`)

    const mutator = x => x >= 3 ? x - 1 : x + 1
    console.log(`Part 2: Exits in ${exitVelocity(dataArray, mutator)} steps`)
})

puzzle("day6", (data) => {
    const blocks = data.split("\t").map(parseFloat)
    const SM = require("./day6")

    const sm = new SM(blocks)
    const stateSet = {}

    let cycles = 0;
    while(stateSet[JSON.stringify(sm.blocks)] === undefined) {
        stateSet[JSON.stringify(sm.blocks)] = cycles
        sm.rebalance()
        cycles++
    }

    console.log(`Part 1: Loop detected in ${cycles} steps`)

    const length = cycles - stateSet[JSON.stringify(sm.blocks)]
    console.log(`Part 2: Loop length is ${length} steps`)
})

puzzle("day7", () => {
    const day7 = require("./day7")
    const parser = new day7.Parser("data/day7.txt")
    const builder = new day7.Builder()

    let node = null;
    while(node = parser.next()) {
        builder.attach(node)
    }
    console.log(`Part 1: Root node is ${builder.roots[0].id}`)

    const balancer = new day7.Balancer()
    balancer.visit(builder.roots[0])

    const unbalanced = [].concat(balancer.unbalanced).sort((a, b) => {
        const aWeight = a.childWeights.reduce((max, c) => Math.max(c.weight, max), 0)
        const bWeight = b.childWeights.reduce((max, c) => Math.max(c.weight, max), 0)

        return aWeight > bWeight ? 1 : -1
    })

    const highest = unbalanced[0]

    const freqDist = {}
    highest.childWeights.forEach(c => freqDist[`${c.weight}`] = (freqDist[`${c.weight}`] || 0) + 1)

    const anomalousWeight = parseInt(Object.keys(freqDist).find(k => freqDist[k] === 1))
    const targetTotalWeight = parseInt(Object.keys(freqDist).find(k => k != anomalousWeight))
    
    const changeTarget = highest.childWeights.find(c => c.weight == anomalousWeight)
    console.log(`Part 2: Node ${changeTarget.id} has total weight ${changeTarget.weight}, should be ${targetTotalWeight}`)
    console.log(`Part 2: Node ${changeTarget.id} should have own weight of ${changeTarget.selfWeight - (anomalousWeight - targetTotalWeight)}`)
})

puzzle("day8", (data) => {
    const day8 = require("./day8")
    const interpreter = new day8.Interpreter()
    const instructions = data.split("\n").map(x => x.trim())

    let globalMax = undefined
    instructions.forEach(instruction => {
        interpreter.evaluate(instruction)
        const max = Object.keys(interpreter.registers).map(k => interpreter.registers[k]).sort((a, b) => a > b ? 1 : -1).reverse()[0]
        if (max === undefined) return
        if (globalMax === undefined) globalMax = max
        else globalMax = Math.max(max, globalMax)
    })

    const max = Object.keys(interpreter.registers).map(k => interpreter.registers[k]).sort((a, b) => a > b ? 1 : -1).reverse()[0]
    console.log(`Part 1: Maximum register value is ${max}`)
    console.log(`Part 2: Maximum register value at any point was ${globalMax}`)
})

puzzle("day12", () => {
    const day12 = require("./day12")
    const parser = new day12.Parser("data/day12.txt")
    const groups = day12.group(parser)
    
    const groupWith0 = groups.find(x => x.has(0))
    console.log(`Part 1: Group with program 0 has ${groupWith0.size} elements`)

    console.log(`Part 2: Total number of groups is ${groups.length}`)
})

puzzle("day13", () => {
    const day13 = require("./day13")
    const parser = new day13.Parser("data/day13.txt")
    const layers = day13.buildLayers(parser)
    
    console.log(`Part 1: Trip severity is ${day13.severity(layers)}`)

    console.log(`Part 2: Evasion requires a delay of ${day13.stealthDelay(layers,100000000)}ps`)
})