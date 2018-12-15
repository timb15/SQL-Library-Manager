var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* GET home page. */
router.get('/', function(req, res, next) {
  Book.findAll({order:[['title', 'ASC']]}).then(function(books) {
    res.render('index', {books});
  });
});
/*Post new book */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
     res.redirect('/books/' + book.id);
  }); 
});

/* Create new book form. */
router.get('/new', function(req, res, next) {
  res.render('new_book', {book: Book.build()});
});


/*Update book details*/
router.post('/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book) {
    return book.update(req.body);
  }).then(function(updatedBook) {
    res.redirect('/books/' + updatedBook.id);
  });
});

/*Delete book*/
router.post('/:id/delete', function(req, res, next) {
  Book.findById(req.params.id).then(function(book) {
    return book.destroy();
  }).then(function() {
    res.redirect('/books');
  });
});

/* GET individual book details. */
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then(function(book) {
    res.render('book_details', {book});
  });  
});

module.exports = router;