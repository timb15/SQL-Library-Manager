const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET home page. */
router.get('/', (req, res, next) => {
  Book.findAndCountAll({ order: [['title', 'ASC']], limit: 7 }).then((books) => {
    if (books) {
      res.render('index', {
        books: books.rows,
        count: books.count,
        route: 'page',
        title: 'All Books'
      });
    } else {
      res.send(404, "Page Not Found!");
    }
  }).catch((err) => {
    res.send(500);
  });
});

//Display results from clicking pagination link
router.get('/page', (req, res, next) => {
  const offset = req.query.offset;
  Book.findAndCountAll({ order: [['title', 'ASC']], offset: offset, limit: 7 }).then((books) => {
    if (books) {
      res.render('index', {
        books: books.rows,
        count: books.count,
        route: 'page',
        title: 'All Books'
      });
    } else {
      res.send(404, "Page Not Found!");
    }
  }).catch((err) => {
    res.send(500);
  });
});

//Display list of books based on search query
router.get('/search', (req, res, next) => {
  const query = req.query.query;
  const searched = true; //used to add home link to search results

  Book.findAndCountAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query}%`
          }
        },
        {
          author: {
            [Op.like]: `%${query}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${query}%`
          }
        },
        {
          year: {
            [Op.like]: `%${query}%`
          }
        }
      ]
    },
    order: [['title', 'ASC']],
    limit: 7
  }).then((books) => {
    if (books) {
      res.render('index', {
        books: books.rows,
        count: books.count,
        searched,
        route: 'searchpage',
        title: `Search Results for "${query}"`,
        query
      });
    } else {
      res.send(404, "Page Not Found!");
    }
  }).catch((err) => {
    res.send(500);
  });
});

//Display a page of search results
router.get('/searchpage', (req, res, next) => {
  const query = req.query.query;
  const offset = req.query.offset;
  const searched = true; //used to add home link to search results

  Book.findAndCountAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query}%`
          }
        },
        {
          author: {
            [Op.like]: `%${query}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${query}%`
          }
        },
        {
          year: {
            [Op.like]: `%${query}%`
          }
        }
      ]
    },
    order: [['title', 'ASC']],
    offset: offset,
    limit: 7
  }).then((books) => {
    if (books) {
      res.render('index', {
        books: books.rows,
        count: books.count,
        searched,
        route: 'searchpage',
        title: `Search Results for "${query}"`,
        query
      });
    } else {
      res.send(404, "Page Not Found!");
    }
  }).catch((err) => {
    res.send(500);
  });
});

/*Post new book */
router.post('/', (req, res, next) => {
  Book.create(req.body).then((book) => {
    if (book) {
      res.redirect('/books/' + book.id);
    } else {
      res.send(404);
    }
  }).catch((err) => {
    if (err.name === "SequelizeValidationError") {
      res.render('new-book', { book: Book.build(req.body), errors: err.errors });;
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500);
  });
});

/* Create new book form. */
router.get('/new', (req, res, next) => {
  res.render('new-book', { book: Book.build() });
});


/*Update book details*/
router.post('/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then((book) => {
    res.redirect(`/books/${book.id}`);
  }).catch((err) => {
    if (err.name === "SequelizeValidationError") {
      const book = req.body;
      book.id = req.params.id;

      res.render('book-details', { book, errors: err.errors });;
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500);
  })
});

/*Delete book*/
router.post('/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(() => {
    res.redirect('/books');
  }).catch((err) => {
    res.send(500);
  })
});

/* GET individual book details. */
router.get('/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      res.render('book-details', { book });
    } else {
      res.send(404, "Sorry the book you are looking for was not found!");
    }
  }).catch((err) => {
    res.send(500);
  });
});

module.exports = router;