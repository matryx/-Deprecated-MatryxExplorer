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
      host: process.env.IPFS_CACHE_HOST,
      database: process.env.IPFS_CACHE_NAME,
      user: process.env.IPFS_CACHE_USER,
      password: process.env.IPFS_CACHE_PASS
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
