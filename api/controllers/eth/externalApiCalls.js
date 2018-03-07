const http = require('http');
const fetch = require('node-fetch');



var externalApiCalls = {};

// externalApiCalls.platformInfoApiCall = function () {
//             return fetch('http://health.matryx.ai/latestPlatformInfo').then(results =>{ return results.json()})
//             };

//
// externalApiCalls.platformInfoApiCall = async function() {
//     try{
//         let data = await fetch('http://health.matryx.ai/latestPlatformInfo');
//         return data;
//
//     }
//     catch{
//
//     }
// };


externalApiCalls.platformInfoApiCall = async function() {
    try {
        const response = await fetch("http://health.matryx.ai/latestPlatformInfo");
        // console.log(await response.json());
        return response.json();
    }
    catch (err) {
        console.log('API fetch for platform address and ABI failed ', err);
    }
}


module.exports = externalApiCalls;
