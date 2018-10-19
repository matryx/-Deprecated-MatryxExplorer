/**
 * ipfs.js
 * /ipfs routes for interacting with IPFS
 *
 * Authors sam@nanome.ai dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const express = require('express')
const router = express.Router()

const formidable = require('formidable')
const tmp = require('tmp')
const fs = require('fs')

const ipfsCalls = require('../controllers/gateway/ipfsCalls')
const { errorHelper, validateAddress } = require('../helpers/responseHelpers')

// Return a message that this route handles activity calls
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling all requests to /ipfs'
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
  const errorHandler = errorHelper(next, 'Error uploading content')

  try {
    let form = new formidable.IncomingForm()
    let files = []
    let fields = []
    let progress = 0

    console.log('\nPOST /ipfs/upload incoming')

    form
      .on('field', (field, value) => fields.push([field, value]))
      .on('file', (field, file) => files.push(file))
      .on('progress', (bytesReceived, bytesExpected) => {
        let percent = ((bytesReceived / bytesExpected) * 100) | 0
        percent = Math.floor(percent / 25) * 25 // round to 25
        if (percent > progress) {
          progress = percent
          console.log(`  uploading... ${percent}%\r`)
        }
      })
      .on('end', () => {
        // Logic for handling the files + IPFS
        let tmpobj = tmp.dirSync()
        let tempDir = tmpobj.name

        files.forEach(file => {
          // made this sync in the slight chance it doesn't execute before next stuff
          fs.renameSync(file.path, tempDir + '/' + file.name)
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

        let dir = fs.readdirSync(tempDir)
        console.log('\nUploaded files:')
        dir.forEach(file => console.log('  ' + file))

        // Add the tmp folder to IPFS and get back a hash
        console.log('\nPushing to IPFS...')
        ipfsCalls.pushTmpFolderToIPFS(tempDir).then(([descriptionHash, folderHash]) => {
          console.log('Pushed to IPFS\n')
          res.status(200).json({ descriptionHash, folderHash })
        })
      })
      .on('error', errorHandler)

    form.parse(req)
  } catch (err) {
    // istanbul ignore next
    errorHandler(err)
  }
})

module.exports = router
