exports.up = function(knex) {
  return knex.schema.createTable('Hashes', table => {
    table
      .integer('tweetId')
      .references('id')
      .inTable('tweet')
      .notNull();
    table.string('tag');
    
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Hashes');
};
