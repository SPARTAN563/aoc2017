function SM(blocks) {
    this.blocks = (blocks || []).map(x => x); // clone
}

module.exports = SM

SM.prototype.rebalance = function() {
    const max = this.blocks.reduce((max, x) => Math.max(max, x), 0);
    const targetIndex = this.blocks.indexOf(max);

    let bucket = this.blocks[targetIndex];
    this.blocks[targetIndex] = 0;
    let balanceIndex = (targetIndex + 1) % this.blocks.length;
    while (bucket) {
        this.blocks[balanceIndex]++
        bucket--
        balanceIndex = (balanceIndex + 1) % this.blocks.length
    }
}