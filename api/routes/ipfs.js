/*
MatryxExplorer API routing for all round based REST calls

author - sam@nanome.ai
Copyright Nanome Inc 2018
*/

const express = require('express')
const router = express.Router()

const formidable = require('formidable')
const tmp = require('tmp')
const fs = require('fs')

const matryxPlatformCalls = require('../controllers/gateway/matryxPlatformCalls')
const ipfsCalls = require('../controllers/gateway/ipfsCalls')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

// Return a message that this route handles activity calls
// TODO return the landing page events to the UI
// Finish Backend
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handles all requests to /ipfs'
  })
})

router.get('/download/hash/:hash', (req, res, next) => {
  let { hash } = req.params
  // TODO: check IPFS hash
  console.log('>IPFS Router: /download/hash/', hash, 'hit')
  ipfsCalls
    .getIpfsDataFiles(hash)
    .then(message => res.status(200).json({ message }))
    .catch(errorHelper(res, 'Error getting download link'))
})

router.get('/getDescription/hash/:hash', (req, res, next) => {
  let { hash } = req.params
  // TODO: check IPFS hash
  ipfsCalls
    .getIpfsDescriptionOnly(hash)
    .then(message => res.status(200).json({ message }))
    .catch(errorHelper(res, 'Error getting description'))
})

router.get('/getTournamentDescription/address/:address', (req, res, next) => {
  let { address } = req.params
  if (!validateAddress(res, address)) return

  matryxPlatformCalls
    .getTournamentDescription(address)
    .then(message => res.status(200).json({ message }))
    .catch(errorHelper(res, 'Error getting description for ' + address))
})

/*
Takes in a multipart/form-data post call with the following inputs
@input description (string)
@input jsonContent (stringify(json))
@input files (files)

It puts them in a temp folder and then uploads them to IPFS and returns a hash

@returns IPFS Hash (string)

*/
router.post('/upload', (req, res, next) => {
  try {
    let form = new formidable.IncomingForm()
    let files = []
    let fields = []

    let tmpobj = tmp.dirSync()
    form.uploadDir = tmpobj.name

    form
      .on('field', (field, value) => fields.push([field, value]))
      .on('file', (field, file) => files.push([field, file]))
      .on('progress', (bytesReceived, bytesExpected) => {
        let percent = ((bytesReceived / bytesExpected) * 100) | 0
        console.log('Uploading: %' + percent + '\r')
      })
      .on('end', () => {
        // Logic for handling the files + IPFS
        console.log('-> Upload Complete')
        let tempDir = tmpobj.name

        files.forEach(file => {
          fs.rename(file[1].path, form.uploadDir + '/' + file[1].name, err => {
            if (err) console.log('ERROR: ' + err)
          })
        })

        fields.forEach(field => {
          // Check to see if there is a description key in the fields
          if (field[0] == 'description') {
            console.log(field[1]) // This is the description content
            descriptionContent = Buffer.from(field[1])
            descriptionPath = tempDir + '/description.txt'
            // Store the descriptionContent into the tempFolder
            ipfsCalls
              .storeDescriptionToTmp(descriptionContent, descriptionPath)
              .then(result => console.log(result))
          }
          // Check to see if there is a jsonContent key in the fields
          if (field[0] == 'jsonContent') {
            console.log(field[1]) // This is the json content
            jsonContent = Buffer.from(field[1])
            jsonPath = tempDir + '/jsonContent.json'
            ipfsCalls
              .storeDescriptionToTmp(jsonContent, jsonPath)
              .then(result => console.log(result))
          }
        })

        // Add the tmp folder to IPFS and get back a hash
        ipfsCalls.pushTmpFolderToIPFS(tempDir).then(folderHash => {
          // externalApiCalls.curlIpfsIo(ipfsHashResult).then(function (tmp) {
          res.status(200).json({ folderHash })
          // })
        })

        let dir = fs.readdirSync(tempDir)
        console.log('These are the files in the directory:')
        dir.forEach(file => console.log('  ' + file))
      })
    form.parse(req)
  } catch (err) {
    errorHelper(res, 'Error uploading file')
  }
})

module.exports = router
