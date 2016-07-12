'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  file: String,
  hour:Date,
  date:Date,
  day:Number,
  repeat:String,
  active: Boolean
});

module.exports = mongoose.model('Event', EventSchema);
