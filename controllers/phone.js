var Util = require('../helpers/util');

module.exports = function(app, redis_client) {
    app.get('/phone', function(req, res) {
        var phone_secret = req.cookies['phone_secret'];
        res.render('phone_connect', {
            layout: 'mobile_layout',
            connected : false
        });
    });

    app.get('/is_phone_attached/:phone_secret', function(req, res) {
        var phone_secret = req.params.phone_secret;
        Util.getRedisUserData(redis_client, phone_secret, function(data) {
            res.json({ is_connected: data.is_connected });
        });
    });

    app.get('/phone/:phone_secret/action', function(req, res) {
        var phone_secret = req.params.phone_secret;
        Util.getRedisUserData(redis_client, phone_secret, function(data) {
            res.json({ action : "blah" });
        });
    });

    app.get('/phone_connect', function(req, res) {
        var user_name = req.cookies['user_id'];
        var phone_secret = req.cookies['phone_secret'];

        if (!phone_secret) {
            res.redirect("/phone");
            return;
        }
        res.render('phone_connect', {
                    layout: 'mobile_layout',
                    connected: true,
                    user_name : user_name,
                    javascripts : ["/javascripts/phone_action_poller.js"]
                });

    });
    app.get('/phone_stub', function(req, res) {
        var user_name = req.cookies['user_id'];
        var phone_secret = req.cookies['phone_secret'];

        if (!phone_secret) {
            res.redirect("/phone");
            return;
        }
        res.render('phone_stub', {
                    layout: false
        });

    });

    app.post('/phone_connect', function(req, res) {
        var phone_secret = req.body.phone_secret;
        Util.getRedisUserData(redis_client, phone_secret, function(data) {
            if (data.user_name) {
                res.cookie('phone_secret', phone_secret, { httpOnly: false });
                res.cookie('user_name', data.user_name, { httpOnly: false });
                Util.setRedisUserData(redis_client, phone_secret, { is_connected: true }); // Set connected
                res.writeHead(303, {
                    "location": "/phone_stub"
                });
                res.end();
            }else {
                res.redirect('/phone');
            }
        });
    });
}