
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var db = require('./lib/mongo_db');
var model = require('./models/models');

// middleware
//CORS middleware
/*
var allowCrossDomain = function(req, res, next) {
    //res.header('Access-Control-Allow-Origin', config.allowedDomains);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
*/
var allowedHost = {
  'http://localhost:3000': true,
  'localhost:3000': true,
  'http://192.168.0.178:3000': true,
  '192.168.0.178:3000': true
};

var allowCrossDomain = function(req, res, next) {
	//origin -> host
	req.headers["origin"] = req.headers["origin"] || ("http://" + req.headers.host);
	//console.log(req.headers.host);
	//console.log(req.headers.origin);
  if(allowedHost[req.headers.host]) {
  	//console.log("asdfafdasdf");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  } else {
    res.send(403, {auth: false});
  }
}


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

 /*
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
// */

app.get('/', routes.index);
app.get('/tasks', routes.tasks);
app.post('/task', routes.createTask)
app.get('/task/destroy', routes.destroyTask)


//app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// start server with database
db.open(function(){
	routes.setModels(model);
	//var port = app.address().port || 8080;
	var port = 3000;
	app.listen(port, function() {
		console.log("Express server listening on port %d in %s mode", port, app.settings.env);
	});
});
