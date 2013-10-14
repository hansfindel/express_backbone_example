var db = require('./mongo_db')

function handle(callback){
	if(callback){
		return callback
	}else{
		return function(err, results){
			response = {}
			if(err){
				//if error
				//res.status(500);
				response["error"] = err;
				//res.send(response);
				return response;
			}else{
				//res.status(200);
				response["results"] = results;
				//res.send(response);
				return response;
			}
		}
	}
}

module.exports = {
	new: function(name) {
		return {
			name: name, 
			find: function(query, limit, callback) {
				return db.find(this.name, query, limit, handle(callback) );
			},
			findAll: function(query, callback){
				return db.findAll(this.name, query, handle(callback));
			},
			findOne: function(query, callback) {
				return db.findOne(this.name, query, handle(callback))
			},
			findById: function(id, callback){
				return db.findOne(this.name, {_id: id}, handle(callback))
			},
			insert: function(items, callback) {
				return db.insert(this.name, items, handle(callback));
			},
			create: function(item, callback){
				return db.insertOne(this.name, item, handle(callback));
			}, 
			insertOne: function(item, callback) {
				return db.insertOne(this.name, item, handle(callback));
			},
			updateById: function(id, updateQuery, callback) {
				return db.updateById(this.name, id, updateQuery, handle(callback));
			}, 
			updateByMatch: function(match, updateQuery, callback) {
				return db.updateByMatch(this.name, match, updateQuery, handle(callback));
			}
			,remove: function(id) {
				//return db.removeElement(this.name, id, handle( function(){} ) );
				return db.updateById(this.name, id, {show: false}, handle(callback))
			}
			,removeByMatch: function(match, callback){

				return db.updateByMatch(this.name, match, {show: false}, handle(callback))
			}
		}
	}
}