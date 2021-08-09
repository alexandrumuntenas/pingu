module.exports = function (pwd, client) {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express()
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());

    app.use('*/dist', express.static('./services/web'));
    app.use('*/plugins', express.static('./services/web/plugins'));

    require('./routes')(app, client);

    app.listen(pwd, () => {
        console.log(`[OK] Running web-server`);
    })
}