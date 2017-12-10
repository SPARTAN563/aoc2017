const mocha = require("mocha")
const fs = require("fs")

const m = new mocha({
    
})
    
fs.readdirSync("test").forEach(file => {
    if (fs.statSync(`test/${file}`).isFile())
        m.addFile(`test/${file}`)
})

m.run()