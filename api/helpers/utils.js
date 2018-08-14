const ethers = require('ethers')

module.exports = {
  bytesToString(bytes) {
    let arr = bytes.map(b => Array.from(ethers.utils.arrayify(b)))
    let utf8 = [].concat(...arr).filter(x => x)
    return ethers.utils.toUtf8String(utf8)
  },

  stringToBytes(text) {
    let bytes = ethers.utils.toUtf8Bytes(text)
    return ethers.utils.hexlify(bytes)
  },

  stringToBytes32(text, requiredLength) {
    let data = ethers.utils.toUtf8Bytes(text)
    let l = data.length
    let pad_length = 64 - ((l * 2) % 64)
    data = ethers.utils.hexlify(data)
    data = data + '0'.repeat(pad_length)
    data = data.substring(2)
    data = data.match(/.{1,64}/g)
    data = data.map(v => '0x' + v)
    while (data.length < requiredLength) {
      data.push('0x0')
    }
    return data
  },

  fromWei(wei) {
    return +ethers.utils.formatEther(wei.toString())
  },

  toWei(eth) {
    return ethers.utils.parseEther(eth.toString())
  }
}
