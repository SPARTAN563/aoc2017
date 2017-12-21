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

puzzle("day18", data => {
    const day18 = require("./day18")
    const instructions = data.split("\n").map(x => x.trim())

    {
        const hub = new day18.LoopbackHub()
        const interpreter = new day18.Interpreter(instructions, hub.subscribe(), {safeReceive: 1})

        while(true) {
            const result = interpreter.next()
            if (!result) break
            if (result.type === "rcv" && result.result) {
                const sendQueue = interpreter.state.hub.queue
                const lastValue = sendQueue[sendQueue.length - 1]
                console.log(`Part 1: The first rcv instruction received ${lastValue.value}`)
                break
            }
        }
    }

    {
        const hub = new day18.Hub()
        const int1 = new day18.Interpreter(instructions, hub.subscribe(), { p: 0 })
        const int2 = new day18.Interpreter(instructions, hub.subscribe(), { p: 1 })
        const exec = new day18.ParallelExecutor(int1, int2)

        const subscriber = hub.subscribe()

        let i = 0
        let result = null
        while(result = exec.next());

        const sentMessages = subscriber.queue.filter(msg => msg.client === int2.state.hub).length
        console.log(`Part 2: Program 1 sent ${sentMessages} messages`)
    }
})

puzzle("day19", () => {
    const data = fs.readFileSync("data/day19.txt", "utf8")
    const day19 = require("./day19")
    const field = day19.parseField(data)
    const walker = new day19.Walker(field)

    let steps = 1;
    while(walker.next())
        steps++

    console.log(`Part 1: Full path is '${walker.path.join("")}'`)
    console.log(`Part 2: ${steps} steps taken`)
})

puzzle("day20", data => {
    const day20 = require("./day20")
    const parser = new day20.Parser()

    {
        const pf = parser.parseParticleField(data)
        const center = new day20.Vector(0,0,0)

        pf.next(100000)
        console.log(`Part 1: Nearest after 100k steps is '${pf.nearest(center).id}'`)
    }

    {
        console.log(`Part 2: Brute Force Approach`)
        /*
         * This approach simply runs the simulation for a number of steps in
         * the hopes that all collisions will have been resolved at the
         * conclusion of those steps.
         * 
         * At each step, we evaluate the collisions state for the field and
         * remove any colliding particles before advancing the simulation to
         * the next step.
         * 
         * For fields with a low number of collision steps and a bias towards
         * early collisions, this is a very fast solution thanks to the basic
         * integer comparisons and arithmetic required to implement it.
         * 
         * For fields with a very long period over which collisions occur, or
         * where collisions are biased towards the end of the collision space,
         * this approach can be very costly due to its O(N^2) complexity.
         */
        const pf = parser.parseParticleField(data)
        
        let steps = 0
        const stepCount = 500
        while(steps++ < stepCount) {
            const collisions = pf.findCollisions()
            pf.remove(...collisions)
            pf.next()
        }

        console.log(`Part 2: ${pf.particles.length} remaining after ${steps} steps`)
        console.log()
    }

    {
        console.log(`Part 2: Quadratic Search Approach`)
        /*
         * This approach uses a quadratic search algorithm to precisely
         * identify the steps at which collisions occur by identifying
         * the quadratic roots describing the collision positions for
         * each particle pair. It then proceeds to "jump" the simulation
         * to those steps and perform collision detection there.
         * 
         * This approach is initially quite costly due to the floating
         * point arithmetic required to calculate the quadratic roots,
         * however its computational complexity does not increase with
         * the collision window's duration - making it particularly well
         * suited to situations in which collisions are biased late, or
         * occur late in the cycle.
         * 
         * It is also a significantly more precise approach than the brute
         * force one, being able to identify all possible collisions without
         * the risk of guessing your step count too low.
         */
        const pf = parser.parseParticleField(data)
        
        const collisionSteps = pf.findCollisionSteps()
        collisionSteps.reduce((last, current) => {
            pf.next(current - last)
            const collisions = pf.findCollisions()
            pf.remove(...collisions)
            return current
        }, 0)

        console.log(`Part 2: ${pf.particles.length} remaining after ${Math.max(...collisionSteps)} steps`)
    }
})

puzzle("day21", imageData => {
    const day21 = require("./day21")
    const rulesData = fs.readFileSync("data/day21r.txt", "utf8")
    
    const image = new day21.ImageParser().parseImage(imageData.split("\n"))
    const rules = new day21.RuleParserSingleLine().parseRules(rulesData)
    const enhancer = new day21.Enhancer(rules)
    
    {
        let enhanced = image
        for (let i = 0; i < 5; i++) {
            enhanced = enhancer.enhance(enhanced)
        }
        
        const onPixels = enhanced.pixels.reduce((sum, row) => {
            return sum + row.reduce((sum, px) => sum + (px ? 1 : 0), 0)
        }, 0)
        console.log(`Part 1: ${onPixels} are on after 5 iterations (out of ${enhanced.size**2})`)
    }
    
    {
        let enhanced = image
        for (let i = 0; i < 18; i++) {
            enhanced = enhancer.enhance(enhanced)
        }
        
        const onPixels = enhanced.pixels.reduce((sum, row) => {
            return sum + row.reduce((sum, px) => sum + (px ? 1 : 0), 0)
        }, 0)
        console.log(`Part 2: ${onPixels} are on after 18 iterations (out of ${enhanced.size**2})`)
    }
})