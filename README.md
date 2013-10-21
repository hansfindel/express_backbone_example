Express Backbone Example
========================

##Task Manager like Application
The example consists in a local app to manage a list of to-do's. These tasks can be nested or not. The tasks can be deleted, when done so it deletes all the nested tasks as well. 
There are two buttons, one to save the current state and one to go back to the last one. The save button persists the data locally, so when the page is reloaded the items are still there. 

##Backbone
This app uses backbone primarly due to the pseudo-framework it provides. Its easier to manage objects (backbone models/objects) and collections than it is to manage "etereal" objects in javascript. 
This app also leverages on the backbone view objects to display the html and process the templates quickly (with help of underscore). 

###CSS
There are a few things on CSS al well, that are worthy noting. 