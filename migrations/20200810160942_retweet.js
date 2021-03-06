exports.up = function(knex) {
  return knex.schema.createTable('Retweet', table => {
    table
      .string('userId')
      .references('id')
      .inTable('tweeter')
      .notNull();
    table
      .integer('tweetId')
      .references('id')
      .inTable('tweet')
      .notNull();
    table.primary(['userId', 'tweetId']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Retweet');
};
