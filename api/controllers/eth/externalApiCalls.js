const http = require('http');
const fetch = require('node-fetch');

const platformCalls = require('./platformCalls');

var externalApiCalls = {};

externalApiCalls.platformInfoApiCall = function () {
            return fetch('http://health.matryx.ai/latestPlatformInfo').then(results =>{ return results.json()})
            };



module.exports = externalApiCalls;
