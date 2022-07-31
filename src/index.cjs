const deasync = require("deasync");

require = (mod) => {
    let res;
    import(mod).then(m => res = m);
    while (!res) deasync.sleep(100);
    return res;
}

module.exports = {
    ...require('./middleware/index.js'),
    ...require('./utils/index.js')
}
