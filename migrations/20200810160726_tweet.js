exports.up = function(knex) {
  return knex.schema.createTable('Tweet', table => {
    table.increments('id').primary();
    table.string('_type');
    table
      .string('userId')
      .references('id')
      .inTable('tweeter')
      .notNull();
    table.string('content');
    table.time('timestamp');
    table.integer('likeCount').defaultTo(0);
    table.integer('replyCount').defaultTo(0);
    table.integer('retweetCount').defaultTo(0);
    table.integer('reference');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Tweet');
};
