const express = require('express');
const router = express.Router();

router.get('/jukka', function (req, res, next) {
  res.send('Jukka on kova!');
});

router.get('/ole', function (req, res, next) {
  res.send('Ollin sivu');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/hetzku', function (req, res, next) {
  res.send('Hetan sivu');
});

module.exports = router;
