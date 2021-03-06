//var api_host = "http://192.168.0.178:3000";
var api_host = "http://localhost:3000"

//Models
Task = Backbone.Model.extend({
	defaults:{
		text: "some random text", 
	},
	initialize: function(){
		//console.log("new task...")
		if(this.get("tid") == undefined){
			this.attributes["tid"] = parseInt(Date.now());
		}
	},
	childs: function(){
		if(taskCollection){
			if(this.childArray){
				return this.childs; 
			}
			this.childArray = taskCollection.filterByParentId(this.get("tid")).models;
			return this.childArray;
		}else{
			return []; //empty
		}
	}, 
	hasChilds: function(){
		var task_childs = this.childs();
		if(task_childs){
			return task_childs.length > 0;
		}
		return false
	}, 
	update_value: function(key, value){
		this.attributes[key] = value;
	}
});
TasksList = Backbone.Collection.extend({
  model: Task,
  url: function(){
  	//console.log("tasks list url--")
    //return api_host + "/tasks";
  },
  parse: function(response, params){
    //console.log("response: ", response);
    //console.log("params: ", params);
    return response.tasks;
  },
  
  filterByParentId: function(parent_id) {
    filtered = this.filter(function(task) {
      return task.get("parent_id") == parent_id;
    });
    return new TasksList(filtered);
  }, 
  main: function(){
  	filtered = this.filter(function(task) {
  	  var parent = task.get("parent_id");
      return (parent == undefined);
    });
    return new TasksList(filtered);
  },
  getByTid: function(id){
  	filtered = this.filter(function(task) {
      return task.get("tid") == id;
    });
    return filtered[0] || null;
  }
});

//Vars
var task = new Task;
var taskCollection = new TasksList;

taskCollection.fetch = function(){
	var tasks = retrieve();

	this.models = [];
	if(tasks == null || tasks.length == 0){
		this.add( new Task({"text": "text1", "tid": "1"}) )
		this.add( new Task({"text": "text2", "tid": "2"}) )
		this.add( new Task({"text": "text3", "tid": "3"}) )
		this.add( new Task({"text": "t1", "tid": "x1", "parent_id": "1"}) )
		this.add( new Task({"text": "t2", "tid": "x2", "parent_id": "1"}) )
		this.add( new Task({"text": "t3", "tid": "x3", "parent_id": "1"}) )
		this.add( new Task({"text": "t33", "tid": "x1_1", "parent_id": "x1"}) )
		this.add( new Task({"text": "t", "tid": "x1_2", "parent_id": "x1"}) )
		this.add( new Task({"text": "terminator", "tid": "x2_1", "parent_id": "x2"}) )
		this.add( new Task({"text": "tomato", "tid": "x1_1_1", "parent_id": "x1_1"}) )
		this.add( new Task({"text": "tea", "tid": "x1_1_2", "parent_id": "x1_2"}) )
		this.add( new Task({"text": "this", "tid": "x1_2_1", "parent_id": "x2_1"}) )
		this.add( new Task({"text": "that", "tid": "x1_1_2_1", "parent_id": "x1_1_2"}) )
	}else{
		for(var i = 0; i < tasks.length; i++){
			this.add(new Task(tasks[i]))
		}
	}
}
// fake fetch, only local to setup the variables
taskCollection.fetch(); 


//Splash Constants
var SPLASH_TIME_OUT = 500;

//Views
window.SplashView = Backbone.View.extend({
	template: _.template($('#splash').html()),

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});

window.HomeView = Backbone.View.extend({
    template:_.template($('#home').html()),
    initialize:function() {
    	taskCollection.fetch(); 
        _.bindAll(this,'render','addOne');    
        this.collection.bind('reset', this.addOne, taskCollection);
    },

    render:function () {
        var collection = this.collection.main();
        $(this.el).html( this.template({ tasks: collection.models }) );
        return this;
    },

    addOne: function () {
        this.render();
    }
});


var AppRouter = Backbone.Router.extend({
    routes:{
        "":"splash",
        "/":"splash",
        "home":"home"
    },

    //Controllers
    splash:function(){
    	setTimeout(function(){
    		$("div[data-role=page]").remove()
    		$("li.hidden").removeClass("hidden")
    		app.home();
        }, SPLASH_TIME_OUT);
        this.changePage(new SplashView(),'slide',false);
    },
        
    home:function () {
        var home_collection = taskCollection;
        this.changePage(new HomeView({ collection: home_collection }),'slide',true);
    },

    changePage:function (page, pagetransition,reverse) {
        var transition = null;
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
    }
});

$(document).ready(function () {
    app = new AppRouter();
    Backbone.history.start();
});

function compile_template(template_name, params){
	return _.template($("#" + template_name).html(), params);
}

function toggle_arrow(tid){
	element = "span[data-span_id=" + tid + "]"
	$(element).toggleClass("right");
	$(element).children().toggleClass("arrow-right");
	$(element).children().toggleClass("arrow-down");
	$(element).siblings().toggleClass("hidden");
}
function addToTasks(element){
	if(event.which==13){ //enter
		var val = element.value;
		var parent = $(element).parent().parent().data("id");
		var task = new Task({text: val, parent_id: parent})
		taskCollection.add(task);
		var html = compile_template('task', {task: task} )
		var parent_element = $(element).parent();
		$(element).remove()
		$(parent_element).append(html);

		var last_input = $(parent_element).children("input.new_element")
		
		//last_input.attr("autofocus", true)
		//last_input.context["autofocus"] =  true
		//console.log(last_input)
		//last_input.context.select()
		
		var more_html = compile_template('new_element_input', {} )
		$(parent_element).append(more_html);
		
	}	
}
function destroyTask(element){
	var parent = $(element).parent();
	var taskId = parent.data("id");
	var task = taskCollection.getByTid(taskId)
	if(task){
		removeTask(task);
		parent.remove()
	}
}
function removeTask(task){
	if(taskCollection){
		taskCollection.remove(task);
		task.childs()
		for(var i = 0; i < task.childArray.length; i++){
			removeTask(task.childArray[i]);
		}
	}
}
function update_task(element){
	var val = $(element).val()
	var tid = $(element).parent().data("id")
	var task = taskCollection.getByTid(tid)
	task.update_value('text', val)
}
function save(){
	var models = taskCollection.models;
	if(typeof(Storage)!=="undefined"){
    	localStorage.setItem( 'tasks', JSON.stringify(models) );
	}
}
function retrieve(){
	if(typeof(Storage)!=="undefined"){
		var models = JSON.parse( localStorage.getItem( 'tasks' ) );
		return models;
	}
	return [];
}
function back_to_data(){
	taskCollection.fetch();
	//clean current data
	$("div[data-role=content]").html("")
	//print old data
	app.home();
}