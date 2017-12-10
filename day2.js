module.exports = {
    part1: function checksum(spreadsheet) {
        return spreadsheet.split("\n").map(row => row.split("\t").reduce((ctx, n) => {
            const x = parseInt(n)
            ctx.min = ctx.min === null ? x : Math.min(ctx.min, x)
            ctx.max = ctx.max === null ? x : Math.max(ctx.max, x)
            return ctx
        }, {min: null, max: null})).map(row => row.max - row.min).reduce((sum, r) => sum + r, 0)
    },
    part2: function checksum(spreadsheet) {
        return spreadsheet.split("\n").map(row => row.split("\t")).map(row => row.map(parseFloat)).map(row => {
            for(let i = 0; i < row.length; i++)
                for(let j = 0; j < row.length; j++) {
                    if (i === j) continue

                    if (!(row[i] % row[j]))
                        return row[i] / row[j]
                }
        }).reduce((sum, r) => sum + r, 0)
    }
}