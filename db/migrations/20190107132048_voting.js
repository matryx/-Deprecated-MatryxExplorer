
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', table => {
      table.increments('id');
      table.string('eth_address').unique()
      table.string('email')
      table.timestamps(true, true)
    }),

    knex.schema.createTable('vote', table => {
      table.string('voter')
      table.string('recipient')
      table.string('direction')
      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('user'),
    knex.schema.dropTableIfExists('vote')
  ])
};
