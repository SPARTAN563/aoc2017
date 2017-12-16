function fastRotate(list, m) {
    let from = 0;
    let val = list[from];
    let nextGroup = 1;
    for(let i = 0; i < list.length; i++) {
        let to = ((from - m) + list.length) % list.length;
        if(to == from)
            break;

        let temp = list[to];
        list[to] = val;
        from = to;
        val = temp;

        if(from < nextGroup) {
            from = nextGroup++;
            val = list[from];
        }
    }

    return list;
}

/**
 * 
 * @param {Array<string>} moves The moves to execute
 */
function dance(moves, programSet="abcdefghijklmnop") {
    programs = programSet.split("")
    
    moves.forEach(move => {
        switch(move.charAt(0)) {
            case "s":
                // Spin
                const length = parseInt(move.slice(1).trim())
                programs = fastRotate(programs, -length)
                return
            case "x":
                // Swap (pos)
                {
                    const positions = move.slice(1).trim().split("/").map(parseFloat)
                    const temp = programs[positions[0]]
                    programs[positions[0]] = programs[positions[1]]
                    programs[positions[1]] = temp
                    return
                }
            case "p":
                // Swap (named)
                {
                    const positions = move.slice(1).trim().split("/").map(x => programs.indexOf(x))
                    const temp = programs[positions[0]]
                    programs[positions[0]] = programs[positions[1]]
                    programs[positions[1]] = temp
                    return
                }
        }
    })

    return programs.join("")
}

exports.dance = dance