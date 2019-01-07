
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', table => {
    table.string('vote_content')
    table.string('voter')
    table.integer('upvote')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('votes')
};
