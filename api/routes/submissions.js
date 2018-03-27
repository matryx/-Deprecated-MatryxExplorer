/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const bodyParser = require('body-parser')
const formidable = require('formidable')
const tmp = require('tmp')
const fs = require('fs')
const util = require('util')

const externalApiCalls = require('../controllers/gateway/externalApiCalls')
const ethPlatform = require('../controllers/gateway/platformCalls')
const submissionController = require('../controllers/submissionController')
const ipfsCalls = require('../controllers/gateway/ipfsCalls')
const fileHandler = require('../controllers/gateway/fileHandler')

const router = express.Router()

let jsonParser = bodyParser.json({ extended: true })
let bodyParserUrlEncoded = bodyParser.urlencoded({ extended: true })

// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
    message: 'handling GET requests to /submissions'
  })
})

// Return a confirmation the API is live
router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    let sAbi = require('../../data/abi/' + version + '/submission')
    res.status(200).json({
      abi: sAbi
    })
  } catch (err) {
    console.log('Error yo')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

// Return the submission details for a specific submission address
router.get('/address/:submissionAddress', (req, res, next) => {
  const address = req.params.submissionAddress
  details = submissionController.getSubmissionByAddress(address).then(function (result) {
    res.status(200).json({
      submissionTitle: result._submissionTitle,
      submissionAddress: address,
      submissionAuthor: result._submissionAuthor,
      submissionId: result._submissionId,
      submissionDescription: result._submissionDescription,
      submissionCollaborators: result._submissionCollaborators,
      submissionReferences: result._submissionReferences,
      submissionJson: result._submissionJson,
      submissionIpfsHash: result._submissionIpfsHash,
      submissionRewardTotal: result._submissionRewardTotal,
      submissionSelectedRound: result._submissionSelectedRound,
      submissionDate: result._submissionDate,
      parentInfo: [
        {
          currentRound: result._parentInfo._currentRound,
          totalRounds: result._parentInfo._totalRounds,
          roundAddress: result._parentInfo._roundAddress,
          roundMtx: result._parentInfo._roundMtx,
          tournamentName: result._parentInfo._tournamentName,
          tournamentAddress: result._parentInfo._tournamentAddress
        }
      ]
    })
  })
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/getOwner', (req, res, next) => {
  const address = req.params.submissionAddress
  submissionController.getSubmissionOwnerByAddress(address).then(function (result) {
    res.status(200).json({
      submissionOwner: result
    })
  })
})

// Return the submission owner/author for a specific submission address
router.get('/address/:submissionAddress/getIpfsData/:ipfsHash', (req, res, next) => {
  const address = req.params.submissionAddress
  const ipfsHash = req.params.ipfsHash
  console.log('Retrieving submission data from IPFS using externalAddress: ' + ipfsHash)
  // submissionController.getSubmissionOwnerByAddress(address).then(function (result) {
  submissionController.getIpfsDataForSubmission(address, ipfsHash).then(function (result) {
    res.status(200).json({
      hashResult: result
    })
  })
})

// This can handle a file and the description and stores the file upload AND the description into a temp folder which is perfect, and passes everything to IPFS and gets back a hash
router.post('/address/:submissionAddress/uploadToIpfsOneFile', (req, res, next) => {
  var form = new formidable.IncomingForm(),
    files = [],
    fields = []

  var tmpobj = tmp.dirSync()
  console.log('Dir: ', tmpobj.name)

  form.uploadDir = tmpobj.name

  // tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
  //   if (err) throw err
  //
  //   console.log('Dir: ', path)
  //   form.uploadDir = path
  // })

// TODO: Throw this all in a try/catch block
  form
      .on('field', function (field, value) {
        // console.log(field, value)
        fields.push([field, value])
      })
      .on('file', function (field, file) {
        // console.log(field, file)
        files.push([field, file])
      })
      .on('progress', function (bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', function () {
          // Logic for handling the files + IPFS

        console.log('-> Upload Complete')

        // TODO: Add a check to see how many files were uploaded
        /*
        files.forEach(){

        }
        */
        // TODO: Get the exact folder location from the path when I created the temp dir
        // let tempDirectory = '/var/folders/rq/4rg3yzq13ql05mg9xmgj4kl00000gn/T/'
        let tempDirectory = tmpobj.name

        console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        // Check to see if there is a description header
        fields.forEach(function (field) {
          if (field[0] == 'description') {
                // // TODO: Buffer stream into description.txt and put into temp folder
            console.log(field[1]) // This is the description content
            descriptionContent = Buffer.from(field[1])
            descriptionPath = tempDirectory + '/description.txt'
            console.log(descriptionPath)
            // Store the descriptionContent into the tempFolder
            ipfsCalls.storeDescriptionToTmp(descriptionContent, descriptionPath).then(function (result) {
              // fs.readdir(tempDirectory, (err, files) => {
              //   console.log('These are the files in the directory')
              //   files.forEach(file => {
              //     console.log(file)
              //   })
              // })
              console.log(result)

              // TODO: callIPFS upload the whole folder in the tempDirectory and get back a hash
              ipfsCalls.pushTmpFolderToIPFS(tempDirectory).then(function (ipfsHashResult) {
                res.status(200).json({
                  folderHash: ipfsHashResult
                })
              })
            })
            // //For now I am uploading directly to IPFS
            // ipfsCalls.uploadDescriptionOnlyToIPFS(descriptionContent, descriptionPath).then(function (result) {
            //   console.log(result)
            //   res.status(200).json({
            //     fileHash: result
            //   }
            //   // TODO: add this when I can extract the tempDirectory automatically
            //   // cleanupCallback()
            //   )
            // })
          }
        })
        fs.readdir(tempDirectory, (err, files) => {
          console.log('These are the files in the directory')
          files.forEach(file => {
            console.log(file)
          })
        })
      })
  form.parse(req)
})

// This CAN handle multiple files, but I am using it to upload a description.txt
router.post('/address/:submissionAddress/uploadToIpfs', (req, res, next) => {
  var form = new formidable.IncomingForm(),
    files = [],
    fields = []

  tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
    if (err) throw err

    console.log('Dir: ', path)
    form.uploadDir = path
  })

// TODO: Throw this all in a try/catch block
  form
      .on('field', function (field, value) {
        // console.log(field, value)
        fields.push([field, value])
      })
      .on('file', function (field, file) {
        // console.log(field, file)
        files.push([field, file])
      })
      .on('progress', function (bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', function () {
          // Logic for handling the files + IPFS

        console.log('-> Upload Complete')

        // TODO: Add a check to see how many files were uploaded
        /*
        files.forEach(){

        }
        */
        // TODO: Get the exact folder location from the path when I created the temp dir
        let tempDirectory = '/var/folders/rq/4rg3yzq13ql05mg9xmgj4kl00000gn/T/'

        console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        // Check to see if there is a description header
        fields.forEach(function (field) {
          if (field[0] == 'description') {
                // // TODO: Buffer stream into description.txt and put into temp folder
            console.log(field[1]) // This is the description content
            descriptionContent = Buffer.from(field[1])
            descriptionPath = tempDirectory + 'description.txt'
            console.log(descriptionPath)
            // Store the descriptionContent into the tempFolder

            // For now I am uploading directly to IPFS
            ipfsCalls.uploadDescriptionOnlyToIPFS(descriptionContent, descriptionPath).then(function (result) {
              console.log(result)
              res.status(200).json({
                fileHash: result
              }
              // TODO: add this when I can extract the tempDirectory automatically
              // cleanupCallback()
              )
            })
          }
        })

        // TODO: IPFS Call for the entire folder

        // res.writeHead(200, {'content-type': 'multipart/form-data'})
        // res.write('received fields:\n\n ' + util.inspect(fields))
        // res.write('\n\n')
        // // res.write(descriptionHash)
        // res.write('\n\n')
        // res.end('received files:\n\n ' + util.inspect(files))
      })
  form.parse(req)
})

/*
These are are experiemental
*/

// router.post('/address/:submissionAddress/file-upload', (req, res, next) => {
//   let form = new formidable.IncomingForm()
//   form.parse(req, function (err, fields, files) {
//     let path = files.contentFile.path
//     let description = files.contentFile.
//     var oldpath = files.contentFile.path
//     var newpath = '../../tempUploads' + files.contentFile.name
//     fs.rename(oldpath, newpath, function (err) {
//       if (err) throw err
//       console.log('File moved to: ' + newpath)
//     })
//
//     // ipfsCalls.uploadFileToIpfs(description,)
//
//     console.log(files.contentFile.path)
//     console.log(fields)
//
//     res.write('File uploaded and moved!')
//     res.end()
//     // })
//   })
// })

// This works and returns the file fields and file object also handles multiple files
// router.post('/address/:submissionAddress/file-upload2', (req, res, next) => {
//   var form = new formidable.IncomingForm(),
//     files = [],
//     fields = []
//
//   tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
//     if (err) throw err
//
//     console.log('Dir: ', path)
//     form.uploadDir = path
//   })
//
//   form
//       .on('field', function (field, value) {
//         console.log(field, value)
//         fields.push([field, value])
//       })
//       .on('file', function (field, file) {
//         console.log(field, file)
//         files.push([field, file])
//       })
//       .on('end', function () {
//         console.log('-> upload done')
//         res.writeHead(200, {'content-type': 'multipart/form-data'})
//         res.write('received fields:\n\n ' + util.inspect(fields))
//         res.write('\n\n')
//         res.end('received files:\n\n ' + util.inspect(files))
//       })
//   form.parse(req)
// })

// Dear future Sam, This one doesnt work but I dont know why. Suck it, its on you.

// This CAN handle multiple files, but I am using it to upload a description.txt
router.post('/address/:submissionAddress/uploadFileandDescriptionToIpfs', (req, res, next) => {
  var form = new formidable.IncomingForm(),
    files = [],
    fields = []

  var tmpobj = tmp.dirSync()
  console.log('Dir: ', tmpobj.name)
  console.log(tmpobj)
    // Manual cleanup
    // tmpobj.removeCallback();

  // tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
  //   if (err) throw err
  //
  //   console.log('Dir: ', path)
  // })
  form.uploadDir = tmpobj.name

// TODO: Throw this all in a try/catch block in filesController.js
  form
      .on('field', function (field, value) {
        // console.log(field, value)
        fields.push([field, value])
      })
      .on('file', function (field, file) {
        // console.log(field, file)
        files.push([field, file])
      })
      .on('progress', function (bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', function () {
          // Logic for handling the files + IPFS

        console.log('-> Upload Complete')

        // TODO: Add a check to see how many files were uploaded
        console.log(files.length)

        // TODO: Get the exact folder location from the path when I created the temp dir
        let tempDirectory = '/var/folders/rq/4rg3yzq13ql05mg9xmgj4kl00000gn/T/'

        console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        fileHandler.getDescriptionContent(fields).then(function (results) {
            // extract the content and path of the description.txt
          descriptionContent = results[0]
          descriptionPath = results[1]

            // TODO: Logic

          console.log('The descriptionContent is: ' + descriptionContent)
          console.log('The descriptionPath is: ' + descriptionPath)
        })

      //   // Check to see if there is a description header
      //   // Throw this into the fileHandler.js file as a method with a Promise
      //   // fileHandler.getDescriptionContent(fields).then(function (results){  })
      //   //then throw it into the same folder as the uploaded files
      //
      //   fields.forEach(function (field) {
      //     if (field[0] == 'description') {
      //           // // TODO: Buffer stream into description.txt and put into temp folder
      //       console.log(field[1]) // This is the description content
      //       descriptionContent = Buffer.from(field[1])
      //       descriptionPath = tempDirectory + 'description.txt'
      //       console.log(descriptionPath)
      //       // Store the descriptionContent into the tempFolder
      //
      //       // // For now I am uploading directly to IPFS
      //       // ipfsCalls.uploadDescriptionOnlyToIPFS(descriptionContent, descriptionPath).then(function (result) {
      //       //   console.log(result)
      //       //   res.status(200).json({
      //       //     fileHash: result
      //       //   }
      //       //   // TODO: add this when I can extract the tempDirectory automatically
      //       //   // cleanupCallback()
      //       //   )
      //       // })
      //     }
      //   })
      //
      //   // TODO: IPFS Call for the entire folder
      //
      //   // res.writeHead(200, {'content-type': 'multipart/form-data'})
      //   // res.write('received fields:\n\n ' + util.inspect(fields))
      //   // res.write('\n\n')
      //   // // res.write(descriptionHash)
      //   // res.write('\n\n')
      //   // res.end('received files:\n\n ' + util.inspect(files))
      // })
        form.parse(req)
      })
})

// Dear future Sam, the problem here is that the temp directory is not actually working so when I am loading the files from the POST call, it is going into the general temp folder :(
// It is your problem now.
// Love, Sam

// This CAN handle multiple files, but I am using it to upload a description.txt
router.post('/address/:submissionAddress/uploadFileandDescriptionToIpfs2', (req, res, next) => {
  var form = new formidable.IncomingForm(),
    files = [],
    fields = []

  // var tmpobj = tmp.dirSync()
  // console.log('Dir: ', tmpobj.name)
  //
  // form.uploadDir = tmpobj.name

  tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
    if (err) throw err

    console.log('Dir: ', path)
    form.uploadDir = path
  })

// TODO: Throw this all in a try/catch block
  form
      .on('field', function (field, value) {
        // console.log(field, value)
        fields.push([field, value])
      })
      .on('file', function (field, file) {
        // console.log(field, file)
        files.push([field, file])
      })
      .on('progress', function (bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', function () {
          // Logic for handling the files + IPFS

        console.log('-> Upload Complete')

        // TODO: Add a check to see how many files were uploaded
        /*
        files.forEach(){

        }
        */
        // TODO: Get the exact folder location from the path when I created the temp dir
        let tempDirectory = '/var/folders/rq/4rg3yzq13ql05mg9xmgj4kl00000gn/T/'

        console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        // Check to see if there is a description header

        fileHandler.getDescriptionContent(fields, tempDirectory).then(function (results) {
            // extract the content and path of the description.txt
          console.log('The descriptionContent is: ' + descriptionContent)
          console.log('The descriptionPath is: ' + descriptionPath)

            // TODO: Verify that the descriptionContent was stored as a text file in the temp folder
          fs.readdir(tempDirectory, (err, files) => {
            files.forEach(file => {
              console.log(file)
            })
          })
        })

        fields.forEach(function (field) {
          if (field[0] == 'description') {
                // // TODO: Buffer stream into description.txt and put into temp folder
            // console.log(field[1]) // This is the description content
            // descriptionContent = Buffer.from(field[1])
            // descriptionPath = tempDirectory + 'description.txt'
            // console.log(descriptionPath)
            // Store the descriptionContent into the tempFolder

            // For now I am uploading directly to IPFS
            ipfsCalls.uploadDescriptionOnlyToIPFS(descriptionContent, descriptionPath).then(function (result) {
              console.log(result)
              res.status(200).json({
                fileHash: result
              }
              // TODO: add this when I can extract the tempDirectory automatically
              // cleanupCallback()
              )
            })
          }
        })

        // TODO: IPFS Call for the entire folder

        // res.writeHead(200, {'content-type': 'multipart/form-data'})
        // res.write('received fields:\n\n ' + util.inspect(fields))
        // res.write('\n\n')
        // // res.write(descriptionHash)
        // res.write('\n\n')
        // res.end('received files:\n\n ' + util.inspect(files))
      })
  form.parse(req)
})

// This can handle a file and the description and stores the file upload into a temp folder which is perfect, but does not store the description.txt
router.post('/address/:submissionAddress/uploadToIpfsWithTmp', (req, res, next) => {
  var form = new formidable.IncomingForm(),
    files = [],
    fields = []

  var tmpobj = tmp.dirSync()
  console.log('Dir: ', tmpobj.name)

  form.uploadDir = tmpobj.name

  // tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
  //   if (err) throw err
  //
  //   console.log('Dir: ', path)
  //   form.uploadDir = path
  // })

// TODO: Throw this all in a try/catch block
  form
      .on('field', function (field, value) {
        // console.log(field, value)
        fields.push([field, value])
      })
      .on('file', function (field, file) {
        // console.log(field, file)
        files.push([field, file])
      })
      .on('progress', function (bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', function () {
          // Logic for handling the files + IPFS

        console.log('-> Upload Complete')

        // TODO: Add a check to see how many files were uploaded
        /*
        files.forEach(){

        }
        */
        // TODO: Get the exact folder location from the path when I created the temp dir
        // let tempDirectory = '/var/folders/rq/4rg3yzq13ql05mg9xmgj4kl00000gn/T/'
        let tempDirectory = tmpobj.name

        console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        // Check to see if there is a description header
        fields.forEach(function (field) {
          if (field[0] == 'description') {
                // // TODO: Buffer stream into description.txt and put into temp folder
            console.log(field[1]) // This is the description content
            descriptionContent = Buffer.from(field[1])
            descriptionPath = tempDirectory + 'description.txt'
            console.log(descriptionPath)
            // Store the descriptionContent into the tempFolder

            // For now I am uploading directly to IPFS
            ipfsCalls.uploadDescriptionOnlyToIPFS(descriptionContent, descriptionPath).then(function (result) {
              console.log(result)
              res.status(200).json({
                fileHash: result
              }
              // TODO: add this when I can extract the tempDirectory automatically
              // cleanupCallback()
              )
            })
          }
        })
        fs.readdir(tempDirectory, (err, files) => {
          console.log('These are the files in the directory')
          files.forEach(file => {
            console.log(file)
          })
        })

        // TODO: IPFS Call for the entire folder

        // res.writeHead(200, {'content-type': 'multipart/form-data'})
        // res.write('received fields:\n\n ' + util.inspect(fields))
        // res.write('\n\n')
        // // res.write(descriptionHash)
        // res.write('\n\n')
        // res.end('received files:\n\n ' + util.inspect(files))
      })
  form.parse(req)
})

// This can handle a file and the description and stores the file upload AND the description into a temp folder which is perfect, now need to pass to IPFS
router.post('/address/:submissionAddress/uploadToIpfsWithTmpAndDescription', (req, res, next) => {
  var form = new formidable.IncomingForm(),
    files = [],
    fields = []

  var tmpobj = tmp.dirSync()
  console.log('Dir: ', tmpobj.name)

  form.uploadDir = tmpobj.name

  // tmp.dir(function _tempDirCreated (err, path, cleanupCallback) {
  //   if (err) throw err
  //
  //   console.log('Dir: ', path)
  //   form.uploadDir = path
  // })

// TODO: Throw this all in a try/catch block
  form
      .on('field', function (field, value) {
        // console.log(field, value)
        fields.push([field, value])
      })
      .on('file', function (field, file) {
        // console.log(field, file)
        files.push([field, file])
      })
      .on('progress', function (bytesReceived, bytesExpected) {
        var percent = (bytesReceived / bytesExpected * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', function () {
          // Logic for handling the files + IPFS

        console.log('-> Upload Complete')

        // TODO: Add a check to see how many files were uploaded
        /*
        files.forEach(){

        }
        */
        // TODO: Get the exact folder location from the path when I created the temp dir
        // let tempDirectory = '/var/folders/rq/4rg3yzq13ql05mg9xmgj4kl00000gn/T/'
        let tempDirectory = tmpobj.name

        console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        // Check to see if there is a description header
        fields.forEach(function (field) {
          if (field[0] == 'description') {
                // // TODO: Buffer stream into description.txt and put into temp folder
            console.log(field[1]) // This is the description content
            descriptionContent = Buffer.from(field[1])
            descriptionPath = tempDirectory + '/description.txt'
            console.log(descriptionPath)
            // Store the descriptionContent into the tempFolder
            ipfsCalls.storeDescriptionToTmp(descriptionContent, descriptionPath).then(function (result) {
              // fs.readdir(tempDirectory, (err, files) => {
              //   console.log('These are the files in the directory')
              //   files.forEach(file => {
              //     console.log(file)
              //   })
              // })
              console.log(result)
              res.status(200).json({
                fileHash: 'randomHash :)'
              })
            })
            // //For now I am uploading directly to IPFS
            // ipfsCalls.uploadDescriptionOnlyToIPFS(descriptionContent, descriptionPath).then(function (result) {
            //   console.log(result)
            //   res.status(200).json({
            //     fileHash: result
            //   }
            //   // TODO: add this when I can extract the tempDirectory automatically
            //   // cleanupCallback()
            //   )
            // })
          }
        })
        fs.readdir(tempDirectory, (err, files) => {
          console.log('These are the files in the directory')
          files.forEach(file => {
            console.log(file)
          })
        })
      })
  form.parse(req)
})

module.exports = router
