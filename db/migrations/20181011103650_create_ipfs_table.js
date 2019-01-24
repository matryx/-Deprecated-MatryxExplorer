exports.up = function(knex, Promise) {
  return knex.schema.createTable('ipfs', table => {
    table.string('hash').unique()
    table.string('content')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('ipfs')
}
