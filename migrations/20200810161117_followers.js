exports.up = function(knex) {
  return knex.schema.createTable('Followers', table => {
    table
      .string('followerId')
      .references('id')
      .inTable('tweeter')
      .notNull();
    table
      .integer('followingId')
      .references('id')
      .inTable('tweet')
      .notNull();
    table.primary(['followerId', 'followingId']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Followers');
};
