'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    firstName: joi.string()
      .trim()
      .max(15)
      .min(2)
      .label('First Name')
      .required(),

    lastName: joi.string()
      .trim()
      .max(15)
      .min(2)
      .label('Last Name')
      .required(),

    email: joi.string()
      .email()
      .trim()
      .max(50)
      .min(7)
      .label('Email')
      .required(),

    password: joi.string()
      .min(10)
      .label('Password')
      .required()
  }
};
