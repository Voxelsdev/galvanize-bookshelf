// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const boom = require('boom');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const ev = require('express-validation');
const validations = require('../validations/favorites');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
}


router.get('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;

  if ( userId ) {
    knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.user_id', userId)
    .orderBy('books.title', 'ASC')
    .then((rows) => {
      const favorites = camelizeKeys(rows);

      res.send(favorites)
    })
    .catch((err) => {
      next(err);
    });
  }
});

router.get('/favorites/check', authorize, (req, res, next) => {
  const userId = req.token;

  if (userId) {
    const bookId = req.query.bookId;
    knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.book_id', bookId)
    // .then((rows) => {
    //   const favorites = camelizeKeys(rows);
    //
    //   res.send(favorites);
    // })
    .then((rows) => {
      res.send(bookId <= rows.length);
    })
    .catch((err) => {
      next(err);
    })
  }
});

function checkBlank(str) {
  if (!str || !str.trim) {
    return next(boom.create(400, str + ' must not be blank'));
  }
}

router.post('/favorites', authorize, ev(validations.post), (req, res, next) => {
  const { bookId } = req.body;
  const { userId } = req.token;

  // if (isNaN(bookId)) {
  //   return next(boom.create(400, 'Book ID must be an integer'));
  // }

  knex('books')
  .where('id', bookId)
  .first()
  .then((row) => {
    if (!row) {
      throw boom.create(404, 'Book not found');
    }

    return knex('favorites').insert(decamelizeKeys({ userId, bookId }), '*');
  })
  .then((inserted) => {
    const book = camelizeKeys(inserted[0]);

    res.send(book);
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/favorites', authorize, (req, res, next) => {
  const bookId = req.body;
  const userId = req.token;
  let book;

  if (isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('books')
  .where('id', bookId)
  .first()
  .then((row) => {
    if (!row) {
      throw boom.create(404, 'Book not found');
    }

    book = camelizeKeys(row);

    return knex('books').del().where('id', bookId);
  })
  .then(() => {
    res.send(book);
  })
  .catch((err) => {
    next(err);
  })
});

module.exports = router;
