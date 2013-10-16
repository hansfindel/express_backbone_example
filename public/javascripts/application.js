//console.log("asdf")

//var api_host = "http://192.168.0.178:3000";
//var api_host = "localhost:3000"
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
	}
});
TasksList = Backbone.Collection.extend({
  model: Task,
  url: function(){
  	console.log("tasks list url--")
    //return api_host + "/tasks";
  },
  parse: function(response, params){
    console.log("response: ", response);
    console.log("params: ", params);
    return response.tasks;
  },
  //success: function()
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
	console.log("asdfasf")
	this.models = [];
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
}
// fake fetch, only local to setup the variables
taskCollection.fetch(); 


//Splash Constants
var SPLASH_TIME_OUT = 500;

//Views
window.SplashView = Backbone.View.extend({
	// var tag = document.getElementById("splash"),
	// tag = $('#splash')[0], 
	// console.log(tag)
	// template:_.template(   ),
	template: _.template($('#splash').html()),

    render:function () {
        $(this.el).html(this.template());
        return this;
    }
});

window.HomeView = Backbone.View.extend({
    template:_.template($('#home').html()),
    //model: Event, 
    initialize:function() {
    	taskCollection.fetch(); 
        _.bindAll(this,'render','addOne');    
        this.collection.bind('reset', this.addOne, taskCollection);
    },

    render:function () {
        var collection = this.collection.main();
        //console.log("home collection: ", collection)
        $(this.el).html( this.template({ tasks: collection.models }) );
        return this;
    },

    addOne: function () {
        //console.log("homeView addone:")
        this.render();
        //console.log("/homeView addone")
    }

});


var AppRouter = Backbone.Router.extend({

    routes:{
        "":"splash",
        "home":"home"
    },

    //Controllers
    splash:function(){
    	setTimeout(function(){
    		app.home();
        }, SPLASH_TIME_OUT);
    },
        
    home:function () {
        console.log('#home');
        var home_collection = taskCollection;
        this.changePage(new HomeView({ collection: home_collection }),'slide',true);
    },

    changePage:function (page, pagetransition,reverse) {
        var transition = null;
        $(page.el).attr('data-role', 'page');
        //page.render(model.toJSON());
        page.render();
        $('body').append($(page.el));
    }
});

$(document).ready(function () {
    //console.log('document ready');
    app = new AppRouter();
    Backbone.history.start();

});

function compile_template(template_name, params){
	return _.template($("#" + template_name).html(), params);
}

function toggle_arrow(tid){
	element = "span[data-span_id=" + tid + "]"
	console.log(element)
	//console.log($(element))
	$(element).toggleClass("right");
	$(element).children().toggleClass("arrow-right");
	$(element).children().toggleClass("arrow-down");
	$(element).siblings().toggleClass("hidden");
}
function addToTasks(element){
	//console.log("addToTasks")
	//console.log(element)
	//console.log(this)
	if(event.which==13){ //enter
		console.log(element)
		var val = element.value;
		var parent = $(element).parent().parent().data("id");
		//console.log(parent)
		var task = new Task({text: val, parent_id: parent})
		taskCollection.add(task);
		var html = compile_template('task', {task: task} )
		//console.log("html generated:", html)
		var parent_element = $(element).parent();
		$(element).addClass("hidden");
		$(parent_element).append(html);
	}	
}
function destroyTask(element){
	var parent = $(element).parent();
	var taskId = parent.data("id");
	var task = taskCollection.getByTid(taskId)
	if(task){
		removeTask(task);
		parent.addClass("hidden")
	}
}
function removeTask(task){
	if(taskCollection){
		taskCollection.remove(task);
		task.childs()
		//console.log( task.childArray )
		for(var i = 0; i < task.childArray.length; i++){
			removeTask(task.childArray[i]);
		}
	}
}