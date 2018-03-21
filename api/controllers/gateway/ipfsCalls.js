/*
The MatryxExplorer IPFS calls file

authors - sam@nanome.ai
Nanome 2018

https://github.com/ipfs/js-ipfs#use-in-nodejs
*/

const http = require('http')
const fetch = require('node-fetch')
const IPFS = require('ipfs')

const ipfsNode = new IPFS()

let ipfsURL = 'https://ipfs.io/ipfs/'
let ipfsPath = 'QmWaMszSWfs7gp6o3UpvwmSd1Rp9cU1TQsXMXq7sxHJRd7'

console.log(ipfsNode)

// // This should work but it doesnt.....?
// ipfsNode.files.cat(ipfsPath, function (err, file) {
//   if (err) {
//     throw err
//   }
//   console.log(file.toString('utf8'))
// })

let ipfsCalls = {}

ipfsCalls.getIpfsData = function (_ipfsHash) {
  return 'IPFS Hash data that gets returned'
}

module.exports = ipfsCalls
