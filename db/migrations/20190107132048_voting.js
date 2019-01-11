
exports.up = function(knex, Promise) {
  return knex.schema.createTable('vote', table => {
    table.string('voter')
    table.string('recipient')
    table.string('direction')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('votes')
};
