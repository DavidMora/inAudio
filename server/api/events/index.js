'use strict';

var express = require('express');
var controller = require('./event.controller');
var multer = require('multer')
var router = express.Router()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now()+'-'+file.originalname)
  }
})
var upload = multer({ storage: storage })
router.get('/stop-all', controller.stopAll);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', upload.single('cancion'), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
