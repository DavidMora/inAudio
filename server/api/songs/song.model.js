'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SongSchema = new Schema({
  name: String,
  route: String,
  file_name:String,
  extension:String,
  created_at :Date,
});

module.exports = mongoose.model('Song', SongSchema);
