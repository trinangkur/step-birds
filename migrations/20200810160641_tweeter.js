exports.up = function(knex) {
  return knex.schema.createTable('Tweeter', table => {
    table.string('id').primary();
    table.string('name', 30);
    table.date('joiningDate');
    table.string('image_url', 200);
    table.string('bio', 80);
    table.date('dob');
    table.integer('followersCount').defaultTo(0);
    table.integer('followingCount').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tweeter');
};
