/*
The Matryx Platform Smart Contract interaction file

authors - sam@nanome.ai
Nanome 2018
*/

let fileHandler = {}
ipfsURL = process.env.IPFS_URL

fileHandler.getDescriptionContent = function (fields, tempDirectory) {
  return new Promise((resolve, reject) => {
    // Loop through the fields and grab the description
    fields.forEach(function (field) {
      if (field[0] == 'description') {
        // TODO: Buffer stream into description.txt and put into temp folder
        console.log(field[1]) // This is the description content
        descriptionContent = Buffer.from(field[1])
        descriptionPath = tempDirectory + 'description.txt'
        console.log(descriptionPath)

        // Return the descriptionContent(in the form of a Buffer) + descriptionPath
        resolve(descriptionContent, descriptionPath)
      }
    })
  })
}

module.exports = fileHandler

