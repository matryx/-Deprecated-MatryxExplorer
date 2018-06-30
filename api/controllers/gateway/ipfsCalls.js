/*
The MatryxExplorer IPFS calls file

authors - sam@nanome.ai
Nanome 2018

https://github.com/ipfs/js-ipfs#use-in-nodejs
*/

const IPFS = require('ipfs')
const fs = require('fs')

const externalApiCalls = require('../gateway/externalApiCalls')

let ipfsURL = process.env.IPFS_URL
let ipfsPeer = process.env.IPFS_DAEMON_PEER_ID
let ipfsCalls = {}

let options = {
  config: {
    Addresses: {
      Swarm: [
        // '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
}

const ipfsNode = new IPFS(options)

// console.log(ipfsNode.dht.findprovs('QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ'))
// TODO: Create the IPFS cluster in the localhost and make the calls to hold all the data from various nodes

ipfsNode.on('ready', () => {
  // Your node is now ready to use \o/
  console.log('IPFS Online Status: ', ipfsNode.isOnline())

  // console.log(ipfsNode.config.get())
  // console.log(ipfsNode.swarm)
  ipfsNode.swarm.connect(ipfsPeer, (err, result) => {
    console.log('connecting to peers: ', result)
    ipfsNode.swarm.peers((err, peers) => {
      console.log('There are this many peers: ', peers.length)
    })
  })
})

ipfsCalls.connectToPeer = function (_presetPeer) {
  ipfsNode.swarm.connect(_presetPeer, (err, result) => {
    if (err) { return onError(err) }
  })
}

// TODO: This doesnt have a solution yet, IPFS team suggested checking multihash is valid
ipfsCalls.validateIpfsHashExists = function (_ipfsHash) {
  return new Promise((resolve, reject) => {
    ipfsNode.dht.findprovs(_ipfsHash, (err, result) => {
      if (err) { reject(err) }
      console.log('The IPFS hash: ', _ipfsHash, ' is connected by ', result, 'peers')
      resolve(result)
    })
  })
}

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
  fs.writeFileSync(_path, _description)

  console.log('The file was saved!' + '   path = ' + _path + '  description: ' + _description)
  return [_path, _description]
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

// ipfsCalls.pushTmpFolderToIPFS = function (tempDirectory) {
//   return new Promise((resolve, reject) => {
//     let ipfsFilesToUpload = []
//       // parse the tmp folder to grab all of the files in there
//     fs.readdir(tempDirectory, (err, files) => {
//       if (err) { reject(err) }
//       console.log('These are the files in the directory')
//       // Store them in the format that IPFS loves
//       files.forEach(file => {
//     // Get the content of the file with the path and file name and then buffer into content
//         let fileContents = fs.readFileSync(tempDirectory + '/' + file)
//         let ipfsFile = {
//           path: tempDirectory + '/' + file,
//           content: Buffer.from(fileContents)
//         }
//         // Add them to the array
//         ipfsFilesToUpload.push(ipfsFile)
//         console.log(file)
//       })
//       // Now make the IPFS calls
//       ipfsNode.files.add(ipfsFilesToUpload, (err, filesAdded) => {
//         if (err) { reject(err) }
//         console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
//         // Resolve all the hashes
//         resolve(filesAdded[0].hash)
//       })
//     })
//   })
// }

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
          // console.log(fileName)

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
            jsonContent = JSON.parse(file.content.toString('utf8'))
            // console.log('The JSON content is the following: ' + JSON.stringify(jsonContent))
            ipfsResults.jsonContent = jsonContent
          }

          if (fileName != 'description.txt' && fileName != 'jsonContent.json') {
              // TODO:  Check the type of fileContent to see what it is

            downloadLinkToFile = process.env.IPFS_URL + file.path.toString('utf8')
            ipfsFiles.push(downloadLinkToFile)
          }
        }
      })
      console.log('The following files are in the IPFS folder: ')
      console.log(ipfsFileContents)

      ipfsResults.ipfsFiles = ipfsFiles
      resolve(ipfsResults)
    }).catch(function (err) {
      reject(err)
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

    }, (err, filesAdded) => {
      if (err) { reject(err) }
      console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
      resolve(filesAdded[0].hash)
    })
  })
}

/*
EXPERIMENTAL FUNCTIONS
*/

ipfsCalls.getIpfsDescriptionOnly = function (_ipfsHash) {
  // console.log('>IpfsCalls: getDescriptionOnly gateway call recieved. Hitting IPFS Node for data at hash: ' + _ipfsHash)
  return new Promise((resolve, reject) => {
      // Check first to see that the hash is even available before making the call
    // console.log('# of hash peers: ', result)

    _ipfsHash = _ipfsHash + '/description.txt'
    let response = ''
    // console.log('Calling IPFS node to get data')
    // console.log('Online status ', ipfsNode.isOnline())

    ipfsNode.files.get(_ipfsHash).then(function (results) {
      response = results[0].content.toString('utf8')

      // console.log('>IpfsNode: getFiles results', results)
      // console.log('>IpfsNode: getResponseResolved response', response)

      // console.log(response)
      resolve(response)
    }).catch(function (err) {
      reject(err)
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

/*
HELPER FUNCTIONS
*/

module.exports = ipfsCalls
