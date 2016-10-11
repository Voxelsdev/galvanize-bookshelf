'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    bookId: joi.number()
    .required()
    .label('Favorites')
  }
}
