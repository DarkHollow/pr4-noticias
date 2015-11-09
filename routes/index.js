var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.get('/', function(pet, resp) {
  resp.sendStatus(200);
});

module.exports = router;
