const Web3 = require('web3')
const web3 = new Web3()

// inputs: next method and optional error log message
// output: error method that takes in error and sends over response
const errorHelper = (next, response) => error => {
  response = error && error.response || response
  next({ ...error, response })
}

// inputs: response object and address to validate
// output: true if address valid
const validateAddress = (next, address) => {
  if (!web3.isAddress(address)) {
    errorHelper(next, `${address} is not a valid ethereum address`)()
    return false
  }
  return true
}

// input:  function that follows node's error first callback standard
// output: function that returns a Promise instead
const promisify = fn => function () {
  return new Promise((resolve, reject) => {
    fn(...arguments, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

module.exports = {
  errorHelper,
  validateAddress,
  promisify
}
