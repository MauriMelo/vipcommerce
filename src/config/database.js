const dotnev = require('dotenv-flow');

if (!process.env.DB_USER) {
  dotnev.config();
}

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: process.env.DB_LOG === 'false' ? false : console.log, // eslint-disable-line
  define: {
    underscored: true,
  },
};
