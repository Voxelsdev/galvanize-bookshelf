// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.post('/users', (req, res, next) => {
  const { email, firstName, password, lastName } = req.body;

  if (!firstName || !firstName.trim()) {
    return next(boom.create(400, 'First Name must not be blank'));
  }

  if (!lastName || !lastName.trim()) {
    return next(boom.create(400, 'Last Name must not be blank'));
  }

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8 || !password.trim()) {
    return next(boom.create(400, 'Password must be at least 8 characters long'));
  }

  knex('users')
  .where('email', email)
  .then((user) => {
    if (user.length) {
      return next(boom.create(400, 'Email already exists'));
    }

    bcrypt.hash(password, 12)
    .then((hashedPassword) => {
      const insertUser = { email, firstName, hashedPassword, lastName };

      return knex('users').insert(decamelizeKeys(insertUser), '*');
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
  });
});

module.exports = router;
