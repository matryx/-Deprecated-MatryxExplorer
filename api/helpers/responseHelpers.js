const ethHelper = require('./ethHelper')

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
  if (!ethHelper.isAddress(address)) {
    res.status(500).json({
      errorMsg: 'This is not a valid ethereum address'
    })
    return false
  }
  return true
}

module.exports = {
  errorHelper,
  validateAddress
}
