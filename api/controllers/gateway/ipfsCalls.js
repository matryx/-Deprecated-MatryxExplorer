/*
The MatryxExplorer IPFS calls file

authors - sam@nanome.ai
Nanome 2018

https://github.com/ipfs/js-ipfs#use-in-nodejs
*/

const fs = require('fs')

const externalApiCalls = require('../gateway/externalApiCalls')

let ipfsCalls = {}

// Take in the description and the path and store it as description.txt in the path
ipfsCalls.storeFileToTmp = function (content, path) {
  fs.writeFileSync(path, content)

  console.log('The file was saved!\n  path: ' + path + '\n  content: ' + content)
  return [path, content]
}

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
    externalApiCalls.uploadFiles([descriptionPath], false),
    externalApiCalls.uploadFiles(filePaths, true)
  ])

  return [descriptionHash, filesHash]
}

module.exports = ipfsCalls
