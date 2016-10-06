// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const boom = require('boom');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize (req, res, next) {
  jwq.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
}

router.get('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('books.user_id', userId)
    .orderBy('books.title', 'ASC')
    .then((rows) => {
      const favorites = camelizeKeys(rows);

      res.send(favorites)
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
