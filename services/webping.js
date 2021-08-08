module.exports = function (pwd) {
    const express = require('express')
    const app = express()
    const port = pwd;

    app.get('/', (req, res) => {
        res.send('Pingu is online!');
    })

    app.listen(port, () => {
        console.log(`[OK] Running web-server`);
    })
}