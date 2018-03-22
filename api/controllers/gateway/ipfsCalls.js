/*
The MatryxExplorer IPFS calls file

authors - sam@nanome.ai
Nanome 2018

https://github.com/ipfs/js-ipfs#use-in-nodejs
*/

const http = require('http')
const fetch = require('node-fetch')
const IPFS = require('ipfs')
const series = require('async/series')

const ipfsNode = new IPFS()

// Upload the text

let ipfsURL = 'https://ipfs.io/ipfs/'

let ipfsCalls = {}

// TODO: Add file navigation and extraction for correct data and file response
ipfsCalls.getIpfsData = function (_ipfsHash) {
  console.log('Gateway call recieved. Hitting IPFS Node for data at hash: ' + _ipfsHash)
  return new Promise((resolve, reject) => {
    ipfsNode.files.cat(_ipfsHash, (err, data) => {
      if (err) { reject(err) }

      console.log('\nIPFS Node Call Completed. File content:')
      console.log(data.toString('utf8'))

      resolve(data.toString('utf8'))
    })
  })
}

ipfsCalls.uploadToIpfs = function (_file) {
  console.log('Gateway call recieved. Hitting IPFS Node for data hash')
  return new Promise((resolve, reject) => {
    ipfsNode.files.add({
      path: 'hello.txt',
      content: Buffer.from('Hello World 101')
    }, (err, filesAdded) => {
      if (err) { return cb(err) }
      console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
      resolve(filesAdded[0].hash)
    })
  })
}

module.exports = ipfsCalls
