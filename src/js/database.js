const sqlite3 = require('sqlite3').verbose();
const {getDB} = require('../../config');
const schema = require('../queries/schema.json');

const db = new sqlite3.Database(getDB());

const throwError = function(err) {
  if (err) {
    throw err;
  }
};

db.run(schema.tweeter, [], throwError);
db.run(schema.tweet, [], throwError);
db.run(schema.followers, [], throwError);
db.run(schema.likes, [], throwError);
db.run(schema.hashes, [], throwError);
db.run(schema.mentions, [], throwError);
db.run(schema.bookmarks, [], throwError);

module.exports = {db};
