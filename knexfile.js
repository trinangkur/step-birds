const { getDB } = require('./config');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: getDB(),
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: getDB(),
    },
    useNullAsDefault: true,
  },
};
