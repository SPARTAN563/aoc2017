module.exports = function validate(passphrase, transform) {
    const set = new Set()
    transform = transform || function(x) {return x}
    return passphrase.split(" ").map(transform).every(x => {
        if (set.has(x)) return false
        set.add(x)
        return true
    })
}