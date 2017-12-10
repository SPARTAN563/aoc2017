function rotate(list, offset, length) {
    if (length > list.length)
        throw new Error(`Length of ${length} is too large for internal state`)

    const start = offset % list.length
    const end = (start + length) % list.length
    
    if (length <= 1) return list

    if (start < end) {
        return [].concat(
            list.slice(0, start),
            list.slice(start, end).reverse(),
            list.slice(end)
        )
    } else if (start >= end) {
        const reversorLate = list.slice(start)
        const reversorEarly = list.slice(0, end)
        const reversed = [].concat(
            reversorLate,
            reversorEarly
        ).reverse()

        return [].concat(
            reversed.slice(reversorLate.length),
            list.slice(end, start),
            reversed.slice(0, reversorLate.length)
        )
    }
}

exports.rotate = rotate


function round(data, state, currentPosition=0, skipSize=0) {
    data.forEach(byte => {
        const newState = rotate(state, currentPosition, byte)
        currentPosition += byte + skipSize
        skipSize++
        state = newState
    })

    return {
        state,
        currentPosition,
        skipSize
    }
}

exports.round = round

function pack(state, blockSize=16) {
    const blocks = Math.ceil(state.length / blockSize)
    const output = []

    return new Array(blocks).fill(0).map((x, i) => 
        state.slice(16 * i, 16 * (i + 1)).reduce((dense, i) => {
            if (dense === undefined) return i
            return i ^ dense
        })
    )
}

exports.pack = pack

function hash(data, suffix=[17, 31, 73, 47, 23], rounds=64) {
    let skipSize = 0
    let offset = 0

    const dataset = [].concat(
        data.trim().split("").map(x => x.charCodeAt(0)),
        suffix
    )

    let state = new Array(256).fill(0).map((x, i) => i)

    for(let i = 0; i < rounds; i++) {
        const result = round(dataset, state, offset, skipSize)
        state = result.state
        offset = result.currentPosition
        skipSize = result.skipSize
    }

    return new Buffer(pack(state)).toString("hex")
}

exports.hash = hash