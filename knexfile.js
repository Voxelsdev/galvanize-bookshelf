'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev',
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },

  production: {
    client: 'pg',
    connection: 'postgres://vdsnrlagjevoyy:AOKtw6oviA0rdyEWhLHNPP-bmO@ec2-54-243-58-188.compute-1.amazonaws.com:5432/d3nmfbrtrbm8g7',
    pool: {min: 2, max: 7}
  }
};
