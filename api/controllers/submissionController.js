/*
The Matryx submission controller

authors - sam@nanome.ai
Nanome 2018
*/

/*
Imports
*/

const ipfsCalls = require('./gateway/ipfsCalls')
const MatryxSubmission = require('../contracts/MatryxSubmission')

let abis
require('../helpers/getAbis').then(a => abis = a)

let submissionController = {}

submissionController.getSubmissionOwnerByAddress = (submissionAddress) => {
  const Submission = new MatryxSubmission(submissionAddress, abis.submission.abi)
  return Submission.getOwner()
}

submissionController.getIpfsDataForSubmission = (ipfsHash) => {
  console.log('Making gateway call...')
  return ipfsCalls.getIpfsData(ipfsHash)
}

submissionController.uploadToIpfs = (files) => {
  console.log('Making gateway call...')
  return ipfsCalls.uploadToIpfs(files)
}

submissionController.getSubmissionByAddress = async (address) => {
  console.log('Executing submissionController for getting submission details at: ' + '\'' + address + '\'')

  const Submission = new MatryxSubmission(address, abis.submission.abi)

  let data = await Promise.all([
    Submission.getData(),
    Submission.getOwner(),
    Submission.getBalance(),
    Submission.getContributors(),
    Submission.getReferences()
  ])

  const [
    sdata,
    owner,
    reward,
    contributors,
    references
  ] = data

  const {
    title,
    descriptionHash,
    fileHash,
    timeSubmitted
  } = sdata

  const description = await ipfsCalls.getIpfsFile(descriptionHash)

  return {
    address,
    title,
    owner,
    reward,
    description,
    contributors,
    references,
    fileHash,
    timeSubmitted,
  }
}

submissionController.isCreator = (submissionAddress, userAddress) => {
  const Submission = new MatryxSubmission(submissionAddress, abis.submission.abi)
  return Submission.isOwner(userAddress)
}

module.exports = submissionController
