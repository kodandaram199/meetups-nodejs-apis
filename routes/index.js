var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ ServerStatus: 'Pdr Rockzzzzz on port 3001 :)' });
});

module.exports = router;
