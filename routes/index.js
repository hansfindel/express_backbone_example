
/*
 * GET home page.
 */

var db;
module.exports = {
	setModels: function(models){
		db = models;
	},
	index: function(req, res){
		var Task = db.task;
		//console.log(db);
		//console.log(Task);
		//Task.findAll({}, function(err, tasks){
		Task.get_main_tasks(function(err, tasks){
			//console.log(tasks);
  			res.render('index', { title: 'To do manager', tasks: tasks })	
  		});
	}, 
	createTask: function(req, res){
		var params = req.body;
		console.log(params);
		var Task = db.task;
		var callback = function(err, results){
			//console.log(results);
			res.redirect('/');
		}
		Task.build(params, callback);
		//build uses create
	}, 
	destroyTask: function(req, res){
		var url = require('url');
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		var tid = query.tid;
		console.log(query)
		console.log(tid)
		var Task = db.task;
		Task.removeByMatch({"tid": tid}, function(err, results){
			console.log("err: ", err)
			console.log("result: ", results)
			res.redirect('/');
		})
	}
}