//console.log("asdf")

//var api_host = "http://192.168.0.178:3000";
//var api_host = "localhost:3000"
var api_host = "http://localhost:3000"

//Models
Task = Backbone.Model.extend();
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
  filterByCategoryId: function(category_id) {
    filtered = this.filter(function(tevent) {
      return tevent.get("category") == category_id;
    });
    return new TasksList(filtered);
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
	this.add( new Task({"text": "textx1", "tid": "x1", "parent_id": "1"}) )
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
        var collection = this.collection;
        if(collection.length > 0){
            //console.log("prev: ", prev, "ev: ", ev, "next: ", next);
        }
        $(this.el).html( this.template({}) );
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
