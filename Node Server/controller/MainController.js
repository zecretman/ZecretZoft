var ZecretZoftUser = require('../model/ZecretZoftUser.js');

class MainController {

    constructor(app) {
        this.app = app;
        this.fs = require('fs');
        this.initRoute();
    }

    initRoute() {
        var object = this;
        this.app.get('/', function (req, res) {
            res.end(object.index());
        })

        this.app.get('/user', global.auth, function (req, res) {
            res.end(object.getUserListPage());
        });

        this.app.get('/user/plain', global.auth, function (req, res) {
            res.end(JSON.stringify(object.getUser()));
        });

        this.app.post('/login', function (req, res) {
            var data = JSON.parse(req.body.data);
            var dict = object.login(data.loginName, data.password, data.salt)
            dict['url'] = global.serverName + 'user'

            if (dict.uid == -1) {
                req.session.uid = -1;
                res.send(JSON.stringify(dict));
            } else {
                req.session.uid = dict.uid;
                res.send(JSON.stringify(dict));
            }
        });

        this.app.get('/logout', function (req, res) {
            req.session.destroy();
            res.send("logout success!");
        });
    }

    index() {
        // var Mustache = require('mustache');
        // var template = this.fs.readFileSync('./view/index.tpl');
        var template = this.fs.readFileSync('./view/login.tpl');
        return template;
    }

    getUserListPage() {
        var userList = this.getUser()
        var template = this.fs.readFileSync('./view/userList.tpl', 'utf8');
        var topBar = this.fs.readFileSync('./view/topBar.tpl', 'utf8');
        var rendered = Mustache.render(template, {
            topBar: topBar,
            userList: userList
        });
        return rendered;
    }

    getUser() {
        var users = global.session.select(ZecretZoftUser);
        var result = []
        for (var index in users.list) {
            result.push(users.list[index].toSampleDict());
        }
        return result;
    }

    login(loginName, password, salt) {
        var users = global.session.select(ZecretZoftUser, "WHERE loginName='" + loginName + "' LIMIT 1");
        if (users.list.length == 0) {
            return  {'isSuccess': false, 'uid': -1, 'username': false, 'password': false };
        } else {
            var user = users.list[0];
            var sha256 = require('sha256');
            var hash = sha256(user.password + salt);
            if (password == hash) {
                return  {'isSuccess': true, 'uid': user.id, 'username': true, 'password': true };
            } else {
                return  {'isSuccess': false, 'uid': -1, 'username': true, 'password': false };
            }
        }
    }
}

module.exports = MainController;