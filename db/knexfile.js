require('dotenv').config({ path : "../.env" })

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/dev.sqlite3'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
