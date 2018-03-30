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

/*
old and useless but reference until you get multifile handling Completed
*/
//
// // Expose modules in ./support for demo purposes
// require.paths.unshift(__dirname + '/../../support');
//
// /**
//  * Module dependencies.
//  */
//
// var express = require('../../lib/express')
//   , form = require('connect-form');
//
// var app = express.createServer(
//   // connect-form (http://github.com/visionmedia/connect-form)
//   // middleware uses the formidable middleware to parse urlencoded
//   // and multipart form data
//   form({ keepExtensions: true })
// );
//
// app.get('/', function(req, res){
//   res.send('<form method="post" enctype="multipart/form-data">'
//     + '<p>Image: <input type="file" name="image" /></p>'
//     + '<p><input type="submit" value="Upload" /></p>'
//     + '</form>');
// });
//
// app.post('/', function(req, res, next){
//
//   // connect-form adds the req.form object
//   // we can (optionally) define onComplete, passing
//   // the exception (if any) fields parsed, and files parsed
//   req.form.complete(function(err, fields, files){
//     if (err) {
//       next(err);
//     } else {
//       console.log('\nuploaded %s to %s'
//         ,  files.image.filename
//         , files.image.path);
//       res.redirect('back');
//     }
//   });
//
//   // We can add listeners for several form
//   // events such as "progress"
//   req.form.on('progress', function(bytesReceived, bytesExpected){
//     var percent = (bytesReceived / bytesExpected * 100) | 0;
//     process.stdout.write('Uploading: %' + percent + '\r');
//   });
// });

// form({ keepExtensions: true })
// );
//
// app.post('/', function(req, res, next){
//
//   // connect-form adds the req.form object
//   // we can (optionally) define onComplete, passing
//   // the exception (if any) fields parsed, and files parsed
//   req.form.complete(function(err, fields, files){
//     if (err) {
//       next(err);
//     } else {
//       console.log('\nuploaded %s to %s'
//         ,  files.image.filename
//         , files.image.path);
//       res.redirect('back');
//     }
//   });
//
//   // We can add listeners for several form
//   // events such as "progress"
//   req.form.on('progress', function(bytesReceived, bytesExpected){
//     var percent = (bytesReceived / bytesExpected * 100) | 0;
//     process.stdout.write('Uploading: %' + percent + '\r');
//   });
// });
