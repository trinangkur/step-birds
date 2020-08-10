exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tweeter')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('tweeter').insert([
        {id: 1, name: 'revathi', joiningDate: '21-12-2000'}
      ]);
    });
};
