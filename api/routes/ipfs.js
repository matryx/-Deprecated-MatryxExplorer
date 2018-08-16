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
          // made this sync in the slight chance it doesn't execute before next stuff
          fs.renameSync(file[1].path, form.uploadDir + '/' + file[1].name)
        })

        fields.forEach(([name, content]) => {
          // Check to see if there is a description key in the fields
          if (name == 'description') {
            path = tempDir + '/description.txt'
            fs.writeFileSync(path, content)
          }
          // Check to see if there is a jsonContent key in the fields
          if (name == 'jsonContent') {
            path = tempDir + '/jsonContent.json'
            fs.writeFileSync(path, content)
          }
        })

        // Add the tmp folder to IPFS and get back a hash
        ipfsCalls.pushTmpFolderToIPFS(tempDir).then(([descriptionHash, folderHash]) => {
          res.status(200).json({ descriptionHash, folderHash })
        })

        let dir = fs.readdirSync(tempDir)
        console.log('These are the files in the directory:')
        dir.forEach(file => console.log('  ' + file))
      })
    form.parse(req)
  } catch (err) {
    errorHelper(res, 'Error uploading file')(err)
  }
})

module.exports = router
