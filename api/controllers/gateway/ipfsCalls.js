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

const ipfsNode = new IPFS()

// TODO: Create the IPFS cluster in the localhost and make the calls to hold all the data from various nodes

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

ipfsCalls.uploadToIpfs = function (_description) {
  console.log('Gateway call recieved. Hitting IPFS Node for data hash')
  return new Promise((resolve, reject) => {
    ipfsNode.files.add({
      path: 'hello.txt',
      content: Buffer.from(_description)

      // TODO pin the files so they dont disappear after 24 hours
    }, (err, filesAdded) => {
      if (err) { return cb(err) }
      console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
      resolve(filesAdded[0].hash)
    })
  })
}

ipfsCalls.uploadFileToIpfs = function (_file) {
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

/*
HELPER FUNCTIONS AND NOTES
*/

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
