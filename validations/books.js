'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    title: joi.string()
      .label('Title')
      .required()
      .max(30)
      .trim(),
    author: joi.string()
      .label('Author')
      .required()
      .min(2)
      .max(30)
      .trim(),
    description: joi.string()
      .label('Description')
      .required()
      .min(10)
      .max(100)
      .trim(),
    genre: joi.string()
      .label('Genre')
      .required()
      .min(2)
      .max(50)
      .trim(),
    coverUrl: joi.string()
      .label('Cover Url')
      .required()
      .min(14)
      .trim()
  }
};

module.exports.patch = {
  body: {
    title: joi.string()
      .label('Title')
      .max(30)
      .trim(),
    author: joi.string()
      .label('Author')
      .min(2)
      .max(30)
      .trim(),
    description: joi.string()
      .label('Description')
      .min(10)
      .max(100)
      .trim(),
    genre: joi.string()
      .label('Genre')
      .min(2)
      .max(50)
      .trim(),
    coverUrl: joi.string()
      .label('Cover Url')
      .min(14)
      .trim()
  }
};
