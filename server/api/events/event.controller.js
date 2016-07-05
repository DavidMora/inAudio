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
var crons = new Array()
var path = require('path');
// Get list of events
var stopAll = function () {
  for (var i = 0; i < songs.length; i++) {
    songs[i].player.stop();
  }
}
var createJob = function (datos) {
  var job = new CronJob('', function () {
      /*
       * Runs every weekday (Monday through Friday)
       * at 11:30:00 AM. It does not run on Saturday
       * or Sunday.
       */
    }, function () {
      /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    timeZone /* Time zone of this job. */
  );
  crons.push({data: datos, job: job});
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
    }
  }
}
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
