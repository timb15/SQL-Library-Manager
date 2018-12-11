var express = require('express');
var router = express.Router();
var Book = require('../models').book;

/* GET home page. */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(books) {
    res.render('books/index', {books: books});
  });
});

// router.post('/', function(req, res, next) {
//   Book.create(req.body).then(function(book) {
//     res.redirect("/books/" + book.id);
//   }); 
// });

// /* Create new book form. */
// router.get('/new', function(req, res, next) {
//   res.render('new_book', {book: Book.build()});
// });

// /* GET book details. */
// router.get('/:id', function(req, res, next) {
//   res.render('book_details');
// });

module.exports = router;