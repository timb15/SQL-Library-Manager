var express = require('express');
var router = express.Router();

/* GET book details. */
router.get('/', function(req, res, next) {
  res.render('book_details');
});

module.exports = router;
