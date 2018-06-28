const Web3 = require('web3')
const web3 = new Web3()

// inputs: response object and optional error log message
// output: error method that takes in error and sends over response
const errorHelper = (res, message) => err => {
  console.error('Error on: ' + res.req.originalUrl + ':')
  console.error('   ' + err.type + ': ' + err.message)
  res.status(500).json({ message })
}

// inputs: response object and address to validate
// output: true if address valid
const validateAddress = (res, address) => {
  if (!web3.isAddress(address)) {
    res.status(500).json({
      message: address + ' is not a valid ethereum address'
    })
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
