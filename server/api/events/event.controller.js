/**
 * GET     /events              ->  index
 * POST    /events              ->  create
 * GET     /events/:id          ->  show
 * PUT     /events/:id          ->  update
 * DELETE  /events/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Event = require('./../events/event.model.js');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var Player = require('player');
var songs = new Array()
var jobs = new Array()
var path = require('path');
Date.prototype.getNextWeekDay = function (d) {
  if (d) {
    var next = this;

    next.setDate(this.getDate() - this.getDay() + 7 + d);
    return next;
  }
}
// Get list of events
var stopAll = function () {
  for (var i = 0; i < songs.length; i++) {
    songs[i].player.stop();
  }
}
exports.stopAll = function (req, res, next) {
  stopAll();
  res.status(200).end()
}
var stopPlayer = function (name) {
  for (var i = 0; i < songs.length; i++) {
    if (name == songs[i].name) {
      songs[i].player.stop();
    }

  }
}
var createJob = function (datos, callback, preventSave) {
  var aux = new Date();
  datos.hour = new Date(datos.hour);
  if (datos.repeat !== 'true') { //si no se repite

    if (parseInt(datos.day) == aux.getDay() && aux.getHours() <= datos.hour.getHours() && aux.getMinutes() <= datos.hour.getMinutes()) {
      aux.setHours(datos.hour.getHours())
      aux.setMinutes(datos.hour.getMinutes())
    }
    else {
      aux = aux.getNextWeekDay(datos.day)
    }
    datos.date = aux
    if(!preventSave){
      datos.save()
    }
    var timeZone = 'COT'
    var job = new CronJob(aux, function () {
        stopAll();
        fs.exists('./uploads/' + datos.file, function (exists) {
          if (exists) {
            try {
              var player = new Player('./uploads/' + datos.file);
              songs.push({name: datos.file, player: player, state: 'play'})
              player.play();
              player.on('error', function (err) {
                // when error occurs
                stopAll();
              });
            } catch (err) {
            }
          }
          else {
            throw 'No existe La cancion'
          }
        });
      }, function () {
        /* This function is executed when the job stops */
      },
      true, /* Start the job right now */
      timeZone /* Time zone of this job. */
    );
    job.start()
    jobs.push({data: datos, job: job});
  }
  else {// si se repite por dia
    var job = new CronJob('00 ' + datos.hour.getMinutes() + ' ' + datos.hour.getHours() + ' * * ' + datos.day, function () {
        stopAll();
        fs.exists('./uploads/' + datos.file, function (exists) {
          if (exists) {
            try {
              var player = new Player('./uploads/' + datos.file);
              songs.push({name: datos.file, player: player, state: 'play'})
              player.play();
              player.on('error', function (err) {
                console.log(err)
                // when error occurs
                stopAll();
              });
            } catch (err) {
              console.log('se crashio', err)
            }
          }
          else {
            throw 'No existe La cancion'
          }
        });
      }, function () {
        /* This function is executed when the job stops */
      },
      true, /* Start the job right now */
      timeZone /* Time zone of this job. */
    );
    job.start()
    jobs.push({data: datos, job: job});


  }
}

var stopAllJobs = function () { // stops all the jobs
  for (var i = 0; i < jobs.length; i++) {
    jobs[i].job.stop();
  }
}

var stopJob = function (id) { // stops one job
  for (var i = 0; i < jobs.length; i++) {
    if (id == jobs[i].data._id) {
      jobs[i].job.stop();
      stopPlayer(jobs[i].data.file)
      jobs.splice(i, 1)
    }

  }
}
exports.createNewJob = createJob;

exports.index = function (req, res) {
  Event.find(function (err, events) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(events);
  });
};
// Get a single event
exports.show = function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    if (!event) {
      return res.status(404).send('Not Found');
    }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function (req, res) {
  console.log(req.body)

  Event.create(req.body, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    createJob(event)
    return res.status(201).json(event);
  });
};

// Updates an existing event in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Event.findById(req.params.id, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    if (!event) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(event, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(event);
    });
  });
};

// Deletes a event from the DB.
exports.destroy = function (req, res) {
  stopJob(req.params.id)
  Event.findById(req.params.id, function (err, event) {
    if (err) {
      return handleError(res, err);
    }
    if (!event) {
      return res.status(404).send('Not Found');
    }
    event.remove(function (err) {
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
