
exports.up = function(knex, Promise) {
  return knex.schema.createTable('vote', table => {
    table.string('voter')
    table.string('recipient')
    table.integer('upvote')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('votes')
};
