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
let latestVersion = process.env.LATEST_VERSION

// Return a message showing this endpoint series handles submission requests
router.get('/', (req, res, next) => {
  res.status(200).json({
        // TODO send back the list of tournaments
    message: 'handling GET requests to /submissions'
  })
})

router.get('/getLatestAbi', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxSubmissionAbi(latestVersion).then(function (resultingAbi) {
      console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi
      })
    })
  } catch (err) {
    console.log('Error loading the ABI')
    res.status(200).json({
      errorMessage: 'Sorry, that version does not exist.',
      error: err
    })
  }
})

// TODO: add error response for invalid responses
router.get('/getAbi/:version', (req, res, next) => {
  let version = req.params.version
  try {
    externalApiCalls.getMatryxSubmissionAbi(version).then(function (resultingAbi) {
      console.log(resultingAbi)
      res.status(200).json({
        abi: resultingAbi
      })
    })// implement catch logic later for v1
  } catch (err) {
    console.log('Error loading the ABI')
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
      })
  form.parse(req)
})

/*
These are are experiemental
*/

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

        let tempDirectory = tmpobj.name

        // console.log(util.inspect(files[0][1].path)) // This is where the first file was stored
        // console.log(fields[0][0]) // This is if the first field is 'description', it returns 'description' and fields[0][1] is the description content

        // Check to see if there is a description header
        fields.forEach(function (field) {
          if (field[0] == 'description') {
            console.log(field[1]) // This is the description content
            descriptionContent = Buffer.from(field[1])
            descriptionPath = tempDirectory + '/description.txt'
            console.log(descriptionPath)
            // Store the descriptionContent into the tempFolder
            ipfsCalls.storeDescriptionToTmp(descriptionContent, descriptionPath).then(function (result) {
              console.log(result)

              // TODO: callIPFS upload the whole folder in the tempDirectory and get back a hash
              ipfsCalls.pushTmpFolderToIPFS(tempDirectory).then(function (ipfsHashResult) {
                res.status(200).json({
                  folderHash: ipfsHashResult
                })
              })
            })
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
  // tmpobj.cleanupCallback()
})

module.exports = router
