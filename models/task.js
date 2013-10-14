var Model = require('../lib/model');
var Task = Model.new('tasks');

Task.time = function(){
	return String(Date.now())
}

Task.build = function(params, callback){
	var parent_tid = params["parent_tid"];
	console.log(parent_tid);
	Task.findOne({tid: parent_tid}, function(err, parent){
		if(err){
			return callback(err);
		}
		else{
			console.log("building task")
			console.log("parent: ", parent)
			params["show"] = true;
			params["tid"] = Task.time()
			//params["childs"] = params["childs"] || []
			if(parent){
				//update
				console.log("parent not null!")
				params["main"] = false
				return Task.addChild(parent, params, callback)
			}
			else{
				console.log("parent null!")
				params["main"] = true				
				return Task.create(params, callback)
			}
		}
	})
}
Task.addChild = function(parent_task, params, callback){ 
	// it has a fake id
	//var id = parent_task._id 
	//params["_id"] = id + "-" + Task.time()
	var childs = parent_task.childs || [];
	//console.log("childs: ", childs);
	childs.push(params);
	var tid = parent_task.tid
	Task.updateByMatch({"tid": tid}, {childs: childs}, function(err, success){
		return callback(err, success);
	})
}

Task.get_main_tasks = function(callback){
	//Task.findAll({}, function(e, r){console.log("all tasks: ", r)});
	//Task.findAll({tid: 1381706362446}, function(e, r){console.log("all = ..: ", r)});
	//Task.findOne({tid: 1381706362446}, function(e, r){console.log("one = ..: ", r)});

	Task.findAll({show: true, main: true}, callback);
}

module.exports = Task;
/*{
	task: Task
}*/