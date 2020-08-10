exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('tweeter', table => {
    table.increments('id');
    table.string('name');
    table.date('joiningDate');
    table.string('image_url');
    table.string('bio');
    table.date('dob');
    table.integer('followersCount');
    table.integer('followingCount');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tweeter');
};
