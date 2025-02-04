/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var Event = require('./api/events/event.model.js');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var songs = new Array()
var crons = new Array()
var path = require('path');
// Connect to database
var Event = require('./api/events/event.model.js');
var EventCont = require('./api/events/event.controller.js');


Event.find(function(err,data){
  console.log("event data is",data)
  var i, event;
  for(i=0;i<data.length;i++){
    event = data[i];
    if(!event || !event.hour){
      continue;
    }
    EventCont.createNewJob(event,function(){},true)
    console.log(new Date(event.hour).getTime(),event.hour.getTime())
  }
})

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express()
, cors = require('cors')
app.use(cors());
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
