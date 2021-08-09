module.exports = function (app, con) {

    app.get('/', function (req, res) {
        res.render('login');
    })

    app.post('/', function (req, res) {
        var lan = require(`../languages/es.json`);
        lan = lan.web;
        console.log(req.body.uj49kfl);
        var guild = {};
        res.render('panel', { lan: lan, guild: guild });
    })

    app.get('/status', function (req, res) {
        res.send('Pingu is online!');
    });

}