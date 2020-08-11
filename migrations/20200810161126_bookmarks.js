exports.up = function(knex) {
  return knex.schema.createTable('Bookmarks', table => {
    table
      .integer('tweetId')
      .references('id')
      .inTable('tweet')
      .notNull();
    table
      .string('userId')
      .references('id')
      .inTable('tweeter')
      .notNull();
    table.primary(['userId', 'tweetId']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Bookmarks');
};
