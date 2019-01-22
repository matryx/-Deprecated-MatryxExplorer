const db = require('./index')

const ipfsURL = process.env.IPFS_URL || "https://ipfs.infura.io/ipfs/"

const pendingLookups = {}

module.exports = {
  async cache(hash) {
    const results = await db('ipfs').where({ hash })
    let { content } = results[0] || {}
    if (content) {
      return content
    }

    if (!pendingLookups[hash]) {
      pendingLookups[hash] = new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(ipfsURL + hash)
          if (![200, 304].includes(res.status)) throw res

          content = await res.text()
          resolve(content)

          await db('ipfs').insert({ hash, content })
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
}
