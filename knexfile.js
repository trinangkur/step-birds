// Update with your config settings.
require('dotenv').config({path: './.env'});
const {env} = process;
const {STEP_BIRDS_DATABASE, TEST_DATABASE} = env;

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: STEP_BIRDS_DATABASE
    },
    useNullAsDefault: true
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: TEST_DATABASE
    },
    useNullAsDefault: true
  }
};
