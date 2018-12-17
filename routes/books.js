var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

/* GET home page. */
router.get('/', function(req, res, next) {
  Book.findAll({order: [['title', 'ASC']]}).then(function(books) {
    if(books) {
      res.render('index', {books}); 
    }else {
      res.send(404, "Page Not Found!");
    }
  }).catch(function(err) {
      res.send(500);
  });
});

//Display list of books based on search query
router.get('/search', function (req, res, next) {
  var query = req.query.query;
  var searched = true; //used to add home link to search results

  Book.findAll({
    where: {
      [Op.or]: [
        {
        title: { 
          [Op.like]: `%${query}%`}
        },
        {
        author:{ 
          [Op.like]: `%${query}%`}
        },
        {
        genre: { 
          [Op.like]:`%${query}%`}
        },
        {
        year: { 
          [Op.like]:`%${query}%`}
        }
      ]
    },  
    order: [['title', 'ASC']],
  }).then(function(books) {
    if(books) {
      res.render('index', {books, searched});
    }else {
      res.send(404, "Page Not Found!");
    }
  }).catch(function(err) {
      res.send(500);
  });
});

/*Post new book */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    if(book) {
      res.redirect('/books/' + book.id);
    }else {
      res.send(404);
    }
  }).catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        res.render('new-book', {book: Book.build(req.body), errors: err.errors});;
      }else {
        throw err;
      }
  }).catch(function(err) {
      res.send(500);
  });
});

/* Create new book form. */
router.get('/new', function(req, res, next) {
  res.render('new-book', {book: Book.build()});
});


/*Update book details*/
router.post('/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book) {
    if(book) {
      return book.update(req.body); 
    }else {
      res.send(404);
    }
  }).then(function(book) {
      res.redirect(`/books/${book.id}`);
  }).catch(function(err) {
    if (err.name === "SequelizeValidationError") {
      var book = req.body;
      book.id = req.params.id;

      res.render('book-details', {book, errors: err.errors});;
    }else {
      throw err;
    }
}).catch(function(err) {
      res.send(500);
  })
});

/*Delete book*/
router.post('/:id/delete', function(req, res, next) {
  Book.findById(req.params.id).then(function(book) {
    if(book) {
      return book.destroy();
    }else {
      res.send(404);
    }
  }).then(function() {
      res.redirect('/books');
  }).catch(function(err) {
      res.send(500);
  })
});

/* GET individual book details. */
router.get('/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book) {
    if (book) {
      res.render('book-details', {book}); 
    }else {
      res.send(404, "Sorry the book you are looking for was not found!");
    }
  }).catch(function(err){
      res.send(500);
  }); 
});

module.exports = router;