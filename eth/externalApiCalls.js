const http = require('http');
const fetch = require('node-fetch');

const platformCalls = require('./platformCalls')


let latestPlatformInfo = fetch('http://health.matryx.ai/latestPlatformInfo')
  .then(response => {
    response.json().then(json => {
        console.log(json.results);
        // platformCalls.setPlatformInfo(json.results);
        return json.results;
    });
  })
  .catch(error => {
    console.log(error);
  });

var externalApiCalls = {};

// externalApiCalls.platformInfoApiCall = function () {
//     return new Promise((resolve, reject) =>{
//         fetch('http://health.matryx.ai/latestPlatformInfo'), (error, content) =>{
//             if (error){
//                 return reject(error);
//         }
//             console.log(content.json);
//             return resolve(content.json);
//         }
//     })
//
// }


module.exports = externalApiCalls;
