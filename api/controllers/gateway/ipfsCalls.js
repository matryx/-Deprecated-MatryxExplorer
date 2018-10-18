/**
 * ipfsCalls.js
 * Helper methods for uploading data to IPFS
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const fs = require('fs')
const FormData = require('form-data')
const cache = require('../../../ipfs-cache')

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

  let descriptionHash, filesHash

  // istanbul ignore next
  if (descriptionPath) {
    descriptionHash = await ipfsCalls.uploadFiles([descriptionPath], false)
  }

  // istanbul ignore next
  if (filePaths.length) {
    filesHash = await ipfsCalls.uploadFiles(filePaths, true)
  }

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

// istanbul ignore next
ipfsCalls.getIpfsFile = async (hash) => {
  return await cache(hash)
}

module.exports = ipfsCalls
