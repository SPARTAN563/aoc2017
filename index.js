const fs = require("fs")
const progress = require("progress")

const filters = process.argv.slice(2)

function puzzle(name, execute) {
    if (!filters.length || !!~filters.indexOf(name)) {
        const input = execute.length && fs.existsSync(`data/${name}.txt`) && fs.readFileSync(`data/${name}.txt`, "utf8").trim()
    
        console.log(`${name}`)
        execute(input)
        console.log()
    }
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

puzzle("day14", () => {
    const day14 = require("./day14")
    const grid = day14.buildGrid("hwlqcszp")
    console.log(`Part 1: There are ${day14.countUsed(grid)} used squares`)

    console.log(`Part 2: There are ${day14.findRegions(grid).length} regions`)
})

puzzle("day15", () => {
    const day15 = require("./day15")
    const genA = new day15.Generator(883, 16807)
    const genB = new day15.Generator(879, 48271)

    let judge = new day15.Judge(genA, genB)
    console.log(`Part 1: ${judge.multiSample(40000000)} matches found in the first 40M samples`)

    genA.reseed(883)
    genB.reseed(879)
    const genA2 = new day15.Filter(genA, x => x % 4 === 0)
    const genB2 = new day15.Filter(genB, x => x % 8 === 0)
    judge = new day15.Judge(genA2, genB2)
    console.log(`Part 2: ${judge.multiSample(5000000)} matches found in the first 5M filtered samples`)
})

puzzle("day16", (data) => {
    const day16 = require("./day16")
    const moves = data.trim().split(",")
    let positions = day16.dance(moves)
    console.log(`Part 1: Final positions are '${positions}'`)

    const memoize = {}
    for (let i = 1; i < 1000000000; i++) {
        if (!memoize[positions]) {
            const newPositions = day16.dance(moves, positions)
            memoize[positions] = newPositions
        }

        positions = memoize[positions]

    }
    console.log(`Part 2: Final positions after 1B dances are '${positions}'`)

})

puzzle("day17", () => {
    const day17 = require("./day17")
    const spinlock = new day17.Spinlock()
    while(spinlock.max() < 2017)
        spinlock.next(335)

    console.log(`Part 1: The next value in the buffer is ${spinlock.getNext()}`)

    const predictive = new day17.SpinlockPredictive([0, 1])
    while(predictive.max() < 50000000) {
        predictive.next(335)
    }

    console.log(`Part 2: The value after 0 in the buffer is ${predictive.getRootNext()}`)
})