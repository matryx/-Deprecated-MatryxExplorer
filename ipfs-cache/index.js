const env = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[env]
const knex = require('knex')(config)

const ipfsURL = process.env.IPFS_URL || "https://ipfs.infura.io/ipfs/"

const pendingLookups = {}

module.exports = async function (hash) {
  const results = await knex('ipfs').where({ hash })
  let { content } = results[0] || {}
  if (content) return content

  if (!pendingLookups[hash]) {
    pendingLookups[hash] = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(ipfsURL + hash)
        if (![200, 304].includes(res.status)) throw res

        content = await res.text()
        resolve(content)

        await knex('ipfs').insert({ hash, content })
      } catch (err) {
        if (err.status === 504) {
          resolve("Error getting description. Please try again later.")
        } else {
          reject(err)
        }
      } finally {
        delete pendingLookups[hash]
      }
    })
  }

  return await pendingLookups[hash]
}
