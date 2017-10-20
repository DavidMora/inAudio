/**
 * GET     /songs              ->  index
 * POST    /songs              ->  create
 * GET     /songs/:id          ->  show
 * PUT     /songs/:id          ->  update
 * DELETE  /songs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Song = require('./song.model')
var fs = require('fs');
var Player = require('player');
var songs = new Array()
var path = require('path');
// Get list of songs

exports.index = function (req, res) {
  Song.find(function (err, songs) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(songs);
  });
};
exports.indexFiles = function (req, res) {
  fs.readdir('./uploads', function (err, items) {
    console.log(items);
    if (items) {
      for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
      }
    }
    return res.status(200).json(items);
  });


};
exports.deleteFile = function (req, res) {
  fs.unlink('./uploads/'+req.params.name, function (err) {
    if (err) throw err;
    console.log(req.params.name + " deleted");
    return res.status(200).json({msg:'deleted'});
  });

};

// Get a single song
exports.show = function (req, res) {
  Song.findById(req.params.id, function (err, song) {
    if (err) {
      return handleError(res, err);
    }
    if (!song) {
      return res.status(404).send('Not Found');
    }
    return res.json(song);
  });
};

var stopAll = function () {
  if (songs) {
    for (var i = 0; i < songs.length; i++) {
      songs[i].player.stop();
    }
  }
}

exports.stopAll = function (req, res, next) {

  stopAll();
  res.status(200).end()
}

exports.play = function (req, res) {
  stopAll();
  fs.exists('./uploads/' + req.params.name, function (exists) {
    if (exists) {
      var player = new Player('./uploads/' + req.params.name);
      songs.push({name: req.params.name, player: player, state: 'play'})
      console.log(songs)
      player.play();
      player.on('error', function (err) {
        console.log(err)
        // when error occurs
        stopAll();
      });
      return res.status(200).json({msg: 'playing song'})
    }
    else {
      res.status(404).json({msg: 'Not Found'})
    }
  });


};

exports.stop = function (req, res) {
  console.log(songs)
  stopAll();
  for (var i = 0; i < songs.length; i++) {
    if (songs[i].name == req.params.name) {
      songs[i].player.stop()
      return res.status(200).json({msg: 'stopped'})
    }
  }
  return res.status(404).json({msg: 'Not Found'})

}

// Creates a new song in the DB.
exports.create = function (req, res) {
  console.log("soy req",req)

  console.log(req.file.originalname)
  if(!req.file.originalname){
    return res.status(400).json("No ha seleccionado ningùn archivo");
  }

  Song.create(req.body, function (err, song) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(req.file.filename);
  });
};

// Updates an existing song in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Song.findById(req.params.id, function (err, song) {
    if (err) {
      return handleError(res, err);
    }
    if (!song) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(song, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(song);
    });
  });
};

// Deletes a song from the DB.
exports.destroy = function (req, res) {
  Song.findById(req.params.id, function (err, song) {
    if (err) {
      return handleError(res, err);
    }
    if (!song) {
      return res.status(404).send('Not Found');
    }
    song.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
