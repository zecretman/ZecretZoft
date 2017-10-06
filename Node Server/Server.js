var defaultPort = process.env.PORT || 80;
var Session = require('./core/xerial/core/Session.js');


global.XerialDBType = {
	'SQLite' : 1,
	'MySQL' : 2,
	'PostgreSQL' : 3,
	'Cassandra': 4,
}

global.models = {}
global.session = 0;
global.serverName = 'https://www.zecretzoft.tk/';

Mustache = require('mustache');

var https = require('https');
var http = require('http');
var spdy = require('spdy');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./ssl/www.zecretzoft.tk-key.pem', 'utf8').toString(),
  cert: fs.readFileSync('./ssl/www.zecretzoft.tk-crt.pem', 'utf8').toString()
};

global.auth = function(req, res, next) {
  if (req.session && req.session.uid != undefined && req.session.uid != -1)
    return next();
  else
    return res.sendStatus(401);
};

var session = require('express-session');

class Server {

    constructor(port) {
        this.express = require('express');
        this.sqlSession = new Session('ZecretZoft.db');
        this.app = this.express();
        this.session
        this.app.use('/', this.express.static('share'));
        this.bodyParser = require('body-parser')
        // this.app.use(this.bodyParser.json());
        this.app.use(this.bodyParser.urlencoded({extended: true}));
        this.app.use(session({
            secret: 'ZORO-2512-SiXzAzz',
            resave: true,
            saveUninitialized: true
        }));
        this.port = port;
        this.initRoute();
    }

    initRoute() {
        const MainController = require('./controller/MainController.js');
        var mainController = new MainController(this.app);
    }

    start() {
        this.initDB();
        // this.app.listen(this.port);
        http.createServer(function (req, res) {
            try {
                if (req.headers['host'].indexOf('www.') == -1) {
                    res.writeHead(301, { "Location": "https://www." + req.headers['host'] + req.url });
                } else {
                    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
                }
                res.end();
            } catch (err) {
                res.end();
            }
            
        }).listen(80);
        spdy.createServer(options, this.app).listen(443);
    }

    initDB() {
        var Models = require('./model/__init__.js');
        var model = new Models();
        this.sqlSession.connect();
		for (var i in global.models) {
			this.sqlSession.appendModel(global.models[i][0], global.models[i][1]);
		}
        this.sqlSession.checkTable();
        global.session = this.sqlSession;
    }
}

var server = new Server(80);
server.start();

console.log('todo list RESTful API server started');