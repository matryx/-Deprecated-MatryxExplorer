/**
 * utils.js
 * Helper methods for converting values from contracts
 *
 * Authors dev@nanome.ai
 * Copyright (c) 2018, Nanome Inc
 * Licensed under ISC. See LICENSE.md in project root.
 */

const ethers = require('ethers')

module.exports = {
  bytesToString(bytes) {
    let arr = bytes.map(b => Array.from(ethers.utils.arrayify(b)))
    let utf8 = [].concat(...arr).filter(x => x)
    return ethers.utils.toUtf8String(utf8)
  },

  // istanbul ignore next
  stringToBytes(text, len = 0) {
    text = text || ''
    let data = ethers.utils.toUtf8Bytes(text)
    let padding = 64 - ((data.length * 2) % 64)
    data = ethers.utils.hexlify(data)
    data = data + '0'.repeat(padding)
    if (len <= 0) return data

    data = data.substring(2)
    data = data.match(/.{1,64}/g)
    data = data.map(v => '0x' + v)
    while (data.length < len) {
      data.push('0x00')
    }
    return data
  },

  fromWei(wei) {
    return +ethers.utils.formatEther(wei.toString())
  },

  // istanbul ignore next
  toWei(eth) {
    return ethers.utils.parseEther(eth.toString())
  }
}
