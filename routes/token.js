// eslint-disable-next-line new-cap
'use strict';

const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const ev = require('express-validation');
const validations = require('../validations/token');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.verify = false;
    } else {
      req.verify = true;
    }

    next();
  });
}

router.get('/token', authorize, (req, res, next) => {
  res.send(req.verify);
});


router.post('/token', ev(validations.post), (req, res, next) => {
  const { email, password } = req.body;

  // if (!email || !email.trim()) {
  //   return next(boom.create(400, 'Email must not be blank'));
  // }
  //
  // if (!password || password.length < 8) {
  //   return next(boom.create(400, 'Password must be at least 8 characters'));
  // }

  let user;

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) { throw boom.create(400, 'Bad email or password'); }

      user = camelizeKeys(row);
      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
      delete user.hashedPassword;

      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' });

      res.cookie('token', token, {
        httpOnly: true,
        expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      next(err);
    });
})

router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.send(true);
})

module.exports = router;
