/*
The MatryxExplorer IPFS calls file

authors - sam@nanome.ai
Nanome 2018

https://github.com/ipfs/js-ipfs#use-in-nodejs
*/

const fs = require('fs')
const fetch = require('node-fetch')
const FormData = require('form-data')

const ipfsURL = process.env.IPFS_URL

let ipfsCalls = {}

ipfsCalls.pushTmpFolderToIPFS = async (tempDirectory) => {
  let filePaths = []
  let descriptionPath

  // parse the tmp folder to grab all of the files in there
  let files = fs.readdirSync(tempDirectory)

  // Store them in the format that IPFS loves
  files.forEach(file => {
    let path = tempDirectory + '/' + file

    if (file === "description.txt") {
      descriptionPath = path
    } else {
      filePaths.push(path)
    }
  })

  let [descriptionHash, filesHash] = await Promise.all([
    ipfsCalls.uploadFiles([descriptionPath], false),
    ipfsCalls.uploadFiles(filePaths, true)
  ])

  return [descriptionHash, filesHash]
}

ipfsCalls.uploadFiles = async (paths, folder) => {
  let wrap = folder ? '?wrap-with-directory=true' : ''

  const data = new FormData()
  paths.forEach(path => data.append('path', fs.createReadStream(path)))

  let response = await fetch('https://ipfs.infura.io:5001/api/v0/add' + wrap, {
    method: 'POST',
    body: data
  })

  let body = await response.text()
  let obj = JSON.parse('[' + body.trim().split('\n').join(',') + ']')
  let hash = obj.pop().Hash

  return hash
}

ipfsCalls.getIpfsFile = async (hash) => {
  let response = await fetch(ipfsURL + hash)
  return await response.text()
}

module.exports = ipfsCalls
