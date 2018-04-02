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
const tmp = require('tmp')
var fs = require('fs')

const ipfsNode = new IPFS()

// TODO: Create the IPFS cluster in the localhost and make the calls to hold all the data from various nodes

let ipfsURL = process.env.IPFS_URL

let ipfsCalls = {}

// TODO: Add file navigation and extraction for correct data and file response
ipfsCalls.getIpfsData = function (_ipfsHash) {
  console.log('Gateway call recieved. Hitting IPFS Node for data at hash: ' + _ipfsHash)
  return new Promise((resolve, reject) => {
    ipfsNode.files.cat(_ipfsHash, (err, data) => {
      if (err) { reject(err) }

      console.log('\nIPFS Node Call Completed. File content:')
      console.log(data.toString('utf8')) // This returns a URL

      resolve(data.toString('utf8'))
    })
  })
}

// Take in the description and the path and store it as description.txt in the path
ipfsCalls.storeDescriptionToTmp = function (_description, _path) {
  return new Promise((resolve, reject) => {
    fs.writeFile(_path, _description, function (err) {
      if (err) {
        return console.log(err)
      }

      console.log('The file was saved!' + '   path = ' + _path + '  description: ' + _description)
      resolve(_path, _description)
    })
  })
}

ipfsCalls.pushTmpFolderToIPFS = function (tempDirectory) {
  return new Promise((resolve, reject) => {
    let ipfsFilesToUpload = []
      // parse the tmp folder to grab all of the files in there
    fs.readdir(tempDirectory, (err, files) => {
      console.log('These are the files in the directory')
      // Store them in the format that IPFS loves
      files.forEach(file => {
    // Get the content of the file with the path and file name and then buffer into content
        let fileContents = fs.readFileSync(tempDirectory + '/' + file)
        let ipfsFile = {
          path: tempDirectory + '/' + file,
          content: Buffer.from(fileContents)
        }
        // Add them to the array
        ipfsFilesToUpload.push(ipfsFile)
        console.log(file)
      })
      // Now make the IPFS calls
      ipfsNode.files.add(ipfsFilesToUpload, (err, filesAdded) => {
        if (err) { return cb(err) }
        console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
        // Resolve all the hashes
        resolve(filesAdded[0].hash)
      })
    })
  })
}

ipfsCalls.getIpfsDataFiles = function (_ipfsHash) {
  console.log('Gateway call recieved. Hitting IPFS Node for data at hash: ' + _ipfsHash)
  return new Promise((resolve, reject) => {
    ipfsNode.files.get(_ipfsHash).then(function (results) {
        // Create a temp storage space

        // Store all the file names into an array
      let ipfsFiles = []
      let ipfsFileContents = []

      let ipfsResults = {}

      results.forEach((file) => {
          // Only grab the files that we want
        if (file.content) {
          let fileName = file.path.toString('utf8').replace(_ipfsHash, '').replace('/', '')
          console.log(fileName)

          ipfsFileContents.push(fileName)

          // Check to see if one is the description.txt file
          if (fileName == 'description.txt') {
              // I want to buffer that into a string
            console.log('The description content is the following: ' + file.content.toString('utf8'))
            description = file.content.toString('utf8')
            ipfsResults.description = description
          }
          // Check to see if one is the jsonContent.json file
          if (fileName == 'jsonContent.json') {
              // I want to buffer that into a string and convert to a json
            jsonContent = JSON.parse(file.content.toString('utf8'))
            console.log('The JSON content is the following: ' + JSON.stringify(jsonContent))
            ipfsResults.jsonContent = jsonContent
          }

          if (fileName != 'description.txt' && fileName != 'jsonContent.json') {
              // TODO:  Check the type of fileContent to see what it is
            console.log('This is a file: ' + fileName)

              // Create a link to download the file
            downloadLinkToFile = process.env.IPFS_URL + file.path.toString('utf8')
            // console.log(downloadLinkToFile)
            ipfsFiles.push(downloadLinkToFile)
          }
        }
      })
      console.log('The following files are in the IPFS folder: ')
      console.log(ipfsFileContents)

      ipfsResults.ipfsFiles = ipfsFiles
      resolve(ipfsResults)
    })
  })
}

/*
HELPER FUNCTIONS AND NOTES
*/

// This is what is working for the file submission
ipfsCalls.uploadDescriptionOnlyToIPFS = function (descriptionContent, descriptionPath) {
  console.log('Gateway call recieved. Hitting IPFS Node for data hash')
  return new Promise((resolve, reject) => {
    ipfsNode.files.add({
      path: descriptionPath,
      content: descriptionContent

      // TODO pin the files so they dont disappear after 24 hours
    }, (err, filesAdded) => {
      if (err) { return cb(err) }
      console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
      resolve(filesAdded[0].hash)
    })
  })
}

/*
EXPERIMENTAL FUNCTIONS
*/

ipfsCalls.getIpfsDescriptionOnly = function (_ipfsHash) {
  console.log('>IpfsCalls: getDescriptionOnly gateway call recieved. Hitting IPFS Node for data at hash: ' + _ipfsHash)
  return new Promise((resolve, reject) => {
    _ipfsHash = _ipfsHash + '/description.txt'
    let response = ''
    console.log('About to call IPFS node to get data')
    ipfsNode.files.get(_ipfsHash).then(function (results) {
      response = results[0].content.toString('utf8')

      console.log('>IpfsNode: getFiles results', results)
      console.log('>IpfsNode: getResponseResolved response', response)

      console.log(response)
      resolve(response)
    }).catch(function (error) {
      console.log('Please throw an error: ' + error.message)
    })
  })
}

/*

//TODO: This is working but need to put it in the controller to handle the files right when they are received and pass the path as a input to ipfsCalls
tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
  if (err) throw err

  console.log('Dir: ', path)

  // Manual cleanup
  cleanupCallback()
})

//https://github.com/danwrong/restler
fs.stat("image.jpg", function(err, stats) {
    restler.post("http://posttestserver.com/post.php", {
        multipart: true,
        data: {
            "folder_id": "0",
            "filename": restler.file("image.jpg", null, stats.size, null, "image/jpg")
        }
    }).on("complete", function(data) {
        console.log(data);
    });
});

// multipart request sending a 321567 byte long file using https
rest.post('https://twaud.io/api/v1/upload.json', {
  multipart: true,
  username: 'danwrong',
  password: 'wouldntyouliketoknow',
  data: {
    'sound[message]': 'hello from restler!',
    'sound[file]': rest.file('doug-e-fresh_the-show.mp3', null, 321567, null, 'audio/mpeg')
  }
}).on('complete', function(data) {
  console.log(data.audio_url);
});

*/

module.exports = ipfsCalls
