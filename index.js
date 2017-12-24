require("colors")
const fs = require("fs")
const progress = require("progress")
const moment = require("moment")

const puzzleFilters = process.argv.slice(2).filter(x => !!~x.indexOf("day"))
const partFilters = process.argv.slice(2).filter(x => !!~x.indexOf("part"))

/**
 * 
 * @param {string} name The name of the puzzle being executed
 * @param {(data: string) => void} execute The function to execute for this puzzle
 */
function puzzle(name, execute) {
    if (!puzzleFilters.length || !!~puzzleFilters.indexOf(name)) {
        const input = execute.length && fs.existsSync(`data/${name}.txt`) && fs.readFileSync(`data/${name}.txt`, "utf8")
        
        console.log(`${name}`.green)
        execute(input)
        console.log()
    }
}

/**
 * 
 * @param {number} number The number of the part beinge executed
 * @param {() => any} execute The function to execute for this part
 */
function part(number, execute) {
    if (!partFilters.length || !!~partFilters.indexOf(`part${number}`)) {
        console.log(`  Part ${number}`.blue)
        const result = execute()
        console.log(`    ${'=>'.grey} ${JSON.stringify(result)} ${`(Part ${number})`.grey}`)
    }
}

/**
 * 
 * @param {string} name The name of the process being executed
 * @param {number} count The total number of iterations to perform
 * @param {number} batchSize The size of each batch to be executed
 * @param {(batchSize: number, currentSum: number, total: number) => void} action An action to execute for each batch
 */
function runIterations(name, count, batchSize, action) {
    let bar = new progress(`  ${name} [:bar] (:current/:total) :eta s`.grey, {
        total: count,
        width: 80
    })

    bar.render()

    let startTime = new Date()
    for(let i = batchSize; i <= count; i+=batchSize) {
        action(batchSize, i, count)
        bar.tick(batchSize)
        bar.render()
    }

    let duration = moment.duration(moment().diff(startTime))

    console.log(`  ${name} completed after %s`.grey, `${duration.asSeconds()}s`.red)
    bar.terminate()
}

puzzle("day1", (data) => {
    const day1 = require("./day1")
    part(1, () => day1.part1(data))
    part(2, () => day1.part2(data))
})

puzzle("day2", (data) => {
    const day2 = require("./day2")
    part(1, () => day2.part1(data))
    part(2, () => day2.part2(data))
})

puzzle("day3", () => {
    const data = 347991
    part(1, () => {
        const distance = require("./day3p1")
        return distance(data)
    })

    part(2, () => {
        const firstGreater = require("./day3p2")
        return firstGreater(data)
    })
})

puzzle("day4", (data) => {
    const validate = require("./day4")
    part(1, () => data.split("\n").filter(x => validate(x)).length)
    part(2, () => {
        const transform = x => Array.prototype.slice.call(x).sort().join("")
        return data.split("\n").filter(x => validate(x, transform)).length
    })
})

puzzle("day5", (data) => {
    const dataArray = data.split("\n").map(x => parseFloat(x.trim()))
    const exitVelocity = require("./day5")
    part(1, () => exitVelocity(dataArray))
    part(2, () => {
        const mutator = x => x >= 3 ? x - 1 : x + 1
        return exitVelocity(dataArray, mutator)
    })
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

    part(1, () => cycles)
    part(2, () => length = cycles - stateSet[JSON.stringify(sm.blocks)])
})

puzzle("day7", () => {
    const day7 = require("./day7")
    const parser = new day7.Parser("data/day7.txt")
    const builder = new day7.Builder()

    part(1, () => {
        let node = null;
        runIterations("Part 1", parser.lines.length, 1, () => {
            if(node = parser.next())
                builder.attach(node)
        })

        return builder.roots[0].id
    })

    part(2, () => {
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
        console.debug(`Node ${changeTarget.id} has total weight ${changeTarget.weight}, should be ${targetTotalWeight}`)
        console.debug(`Node ${changeTarget.id} should have own weight of ${changeTarget.selfWeight - (anomalousWeight - targetTotalWeight)}`)
        return changeTarget.selfWeight - (anomalousWeight - targetTotalWeight)
    })
})

puzzle("day8", (data) => {
    const day8 = require("./day8")
    const interpreter = new day8.Interpreter()
    const instructions = data.split("\n").map(x => x.trim())

    let globalMax = undefined
    runIterations("Executing", instructions.length, 1, (_, i) => {
        const instruction = instructions[i-1]
        interpreter.evaluate(instruction)
        const max = Object.keys(interpreter.registers).map(k => interpreter.registers[k]).sort((a, b) => a > b ? 1 : -1).reverse()[0]
        if (max === undefined) return
        if (globalMax === undefined) globalMax = max
        else globalMax = Math.max(max, globalMax)
    })

    part(1, () => Object.keys(interpreter.registers).map(k => interpreter.registers[k]).sort((a, b) => a > b ? 1 : -1).reverse()[0])
    part(2, () => globalMax)
})

puzzle("day9", data => {
    const day9 = require("./day9")
    const parser = new day9.Parser()
    parser.parse(data)
    
    

    part(1, () => {
        function scoreGroups(root, score=1) {
            const children = root.children.filter(c => c.type === "group")
    
            return score + children.reduce((sum, c) => sum + scoreGroups(c, score + 1), 0)
        }

        return scoreGroups(parser.current().children[0])
    })

    part(2, () => {
        function countGarbage(root) {
            const children = root.children.filter(x => x.type === "group")
            const garbage = root.children.filter(x => x.type === "garbage")

            return children.reduce((sum, c) => sum + countGarbage(c), 0) + garbage.reduce((sum, g) => sum + g.children.length, 0)
        }

        return countGarbage(parser.current().children[0])
    })
})

puzzle("day10", data => {
    const day10 = require("./day10")
    part(1, () => {
        const lengths = data.split(",").map(x => x.trim()).map(parseFloat)
        let state = new Array(256).fill(0).map((x, i) => i)
        const hash = day10.round(lengths, state).state

        return hash[0] * hash[1]
    })

    part(2, () => {
        return day10.hash(data)
    })
})

puzzle("day11", data => {
    const day11 = require("./day11")
    const input = data.trim().split(",")

    part(1, () => {
        const path = day11.steps(input)
        return path.length
    })

    part(2, () => {
        const maxDist = day11.maxDistance(input)
        return maxDist
    })
})

puzzle("day12", () => {
    const day12 = require("./day12")
    const parser = new day12.Parser("data/day12.txt")
    const groups = day12.group(parser)
    
    const groupWith0 = 
    part(1, () => groups.find(x => x.has(0)).size)
    part(2, () => groups.length)
})

puzzle("day13", () => {
    const day13 = require("./day13")
    const parser = new day13.Parser("data/day13.txt")
    const layers = day13.buildLayers(parser)
    
    part(1, () => day13.severity(layers))
    part(2, () => day13.stealthDelay(layers, 1e9))
})

puzzle("day14", () => {
    const day14 = require("./day14")
    const grid = day14.buildGrid("hwlqcszp")

    part(1, () => day14.countUsed(grid))
    part(2, () => day14.findRegions(grid).length)
})

puzzle("day15", () => {
    const day15 = require("./day15")
    const genA = new day15.Generator(883, 16807)
    const genB = new day15.Generator(879, 48271)

    part(1, () => {
        let judge = new day15.Judge(genA, genB)

        let matches = 0
        runIterations("Matching (Unfiltered)", 40e6, 100e3, (c) => {
            for (let i = 0; i < c; i++)
                if (judge.sample()) matches++
        })

        return matches
    })

    part(2, () => {
        genA.reseed(883)
        genB.reseed(879)
        const genA2 = new day15.Filter(genA, x => x % 4 === 0)
        const genB2 = new day15.Filter(genB, x => x % 8 === 0)
        judge = new day15.Judge(genA2, genB2)

        let matches = 0
        runIterations("Matching (Filtered)", 5e6, 100e3, (c) => {
            for (let i = 0; i < c; i++)
                if (judge.sample()) matches++
        })

        return matches
    })
})

puzzle("day16", (data) => {
    const day16 = require("./day16")
    const moves = data.trim().split(",")

    part(1, () => {
        let positions = day16.dance(moves)
        return positions
    })

    part(2, () => {
        let positions = day16.dance(moves)
        const memoize = {}

        runIterations("Dancing", 1e9, 1e6, (c) => {
            for (let i = 0; i < c; i++) {
                if (!memoize[positions]) {
                    const newPositions = day16.dance(moves, positions)
                    memoize[positions] = newPositions
                }
    
                positions = memoize[positions]
            }
        })

        return positions
    })
})

puzzle("day17", () => {
    const day17 = require("./day17")
    
    part(1, () => {
        const spinlock = new day17.Spinlock()

        runIterations("Running", 2017, 1, () => {
            spinlock.next(335)
        })

        return spinlock.getNext()
    })

    part(2, () => {
        const spinlock = new day17.SpinlockPredictive()

        runIterations("Running", 50e6, 5e4, (c) => {
            for(let i = 0; i < c; i++)
                spinlock.next(335)
        })

        return spinlock.getRootNext()
    })
})

puzzle("day18", data => {
    const day18 = require("./day18")
    const instructions = data.split("\n").map(x => x.trim())

    part(1, () => {
        const hub = new day18.LoopbackHub()
        const interpreter = new day18.Interpreter(instructions, hub.subscribe(), {safeReceive: 1})

        while(true) {
            const result = interpreter.next()
            if (!result) break
            if (result.type === "rcv" && result.result) {
                const sendQueue = interpreter.state.hub.queue
                const lastValue = sendQueue[sendQueue.length - 1]
                return lastValue.value
            }
        }
    })

    part(2, () => {
        const hub = new day18.Hub()
        const int1 = new day18.Interpreter(instructions, hub.subscribe(), { p: 0 })
        const int2 = new day18.Interpreter(instructions, hub.subscribe(), { p: 1 })
        const exec = new day18.ParallelExecutor(int1, int2)

        const subscriber = hub.subscribe()

        let i = 0
        let result = null
        while(result = exec.next());

        const sentMessages = subscriber.queue.filter(msg => msg.client === int2.state.hub).length
        return sentMessages
    })
})

puzzle("day19", () => {
    const data = fs.readFileSync("data/day19.txt", "utf8")
    const day19 = require("./day19")
    const field = day19.parseField(data)
    const walker = new day19.Walker(field)

    let steps = 1;
    while(walker.next())
        steps++

    part(1, () => walker.path.join(""))
    part(2, () => steps)
})

puzzle("day20", data => {
    const day20 = require("./day20")
    const parser = new day20.Parser()

    part(1, () => {
        const pf = parser.parseParticleField(data)
        const center = new day20.Vector(0,0,0)

        pf.next(100000)
        return pf.nearest(center).id
    })

    part(2.1, () => {
        console.log(`Part 2: Brute Force Approach`.grey)
        
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
        
        runIterations("Brute Forcing", 500, 1, () => {
            const collisions = pf.findCollisions()
            pf.remove(...collisions)
            pf.next()
        })

        return pf.particles.length
    })

    part(2, () => {
        console.log(`Part 2: Quadratic Search Approach`.grey)
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

        return pf.particles.length
    })
})

puzzle("day21", imageData => {
    const day21 = require("./day21")
    const rulesData = fs.readFileSync("data/day21r.txt", "utf8")
    
    const image = new day21.ImageParser().parseImage(imageData.split("\n"))
    const rules = new day21.RuleParserSingleLine().parseRules(rulesData)
    const enhancer = new day21.Enhancer(rules)
    
    part(1, () => {
        let enhanced = image

        runIterations("Enhancing", 5, 1, () => {
            enhanced = enhancer.enhance(enhanced)
        })
        
        const onPixels = enhanced.pixels.reduce((sum, row) => {
            return sum + row.reduce((sum, px) => sum + (px ? 1 : 0), 0)
        }, 0)

        return onPixels
    })
    
    part(2, () => {
        let enhanced = image

        runIterations("Enhancing", 18, 1, () => {
            enhanced = enhancer.enhance(enhanced)
        })
        
        const onPixels = enhanced.pixels.reduce((sum, row) => {
            return sum + row.reduce((sum, px) => sum + (px ? 1 : 0), 0)
        }, 0)

        return onPixels
    })
})

puzzle("day22", data => {
    const day22 = require("./day22")
    const parser = new day22.Parser()

    part(1, () => {
        const grid = new day22.InfiniteGrid(parser.parseGrid(data))
        const carrier = new day22.Carrier(grid)

        runIterations("☣ Infecting", 10e3, 100, (_, until) => {
            while(carrier.stats.moved < until)
                carrier.next()
        })

        return carrier.stats.infected
    })

    part(2, () => {
        const grid = new day22.InfiniteGrid(parser.parseGrid(data))
        const carrier = new day22.Carrier(grid, "evolve")

        runIterations("☣ Infecting", 10e6, 1e3, (_, until) => {
            while(carrier.stats.moved < until)
                carrier.next()
        })

        return carrier.stats.infected
    })
})

puzzle("day23", data => {
    const day23 = require("./day23")
    const instructions = data.split("\n").map(x => x.trim())

    part(1, () => {
        const interpreter = new day23.Interpreter(instructions, {})

        let mulInvocations = 0
        while(true) {
            const result = interpreter.next()
            if (!result) break
            if (result.type === "mul") {
                mulInvocations++
            }
        }

        return mulInvocations
    })

    part(2, () => {
        let b = 79 * 100 + 100000 // Lower bound
        let c = b + 17000 // Upper bound

        return day23.findCompositeNumbers(b, c, 17)
    })
})

puzzle("day24", data => {
    const day24 = require("./day24")
    const parser = new day24.Parser()
    const components = data.trim().split("\n").map(x => parser.parseComponent(x))
    const builder = new day24.Builder(...components)

    let strongest = null
    let longest = null

    for(const bridge of builder.build()) {
        if (!strongest) strongest = bridge
        if (!longest) longest = bridge

        if (bridge.value > strongest.value) strongest = bridge
        if (bridge.length > longest.length) longest = bridge
        else if(bridge.length === longest.length && bridge.value > longest.value) longest = bridge
    }

    part(1, () => {
        return strongest.value
    })

    part(2, () => {
        return longest.value
    })
})