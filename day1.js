module.exports = {
    part1: function captcha(numbers) {
        let sum = 0
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] === numbers[(i+1)%numbers.length])
                sum += parseInt(numbers[i])
        }

        return sum
    },
    part2: function captcha(numbers) {
        let sum = 0
        const len = numbers.length
        const offset = numbers.length/2
        for (let i = 0; i < len; i++) {
            if (numbers[i] === numbers[(i+offset)%len])
                sum += parseInt(numbers[i])
        }

        return sum
    }
}