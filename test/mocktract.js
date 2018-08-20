const BigNumber = require('big-number')

const isAddress = address => {
  if (typeof address !== 'string') return false
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

const isBytes32 = bytes32 => {
  if (typeof bytes32 !== 'string') return false
  return /^0x[a-fA-F0-9]{1,64}$/.test(bytes32)
}

const isInvalid = (val, type) => {
  const vtype = typeof val

  // null argument okay (maybe?)
  if (val === null) return true

  // array types
  if (type.slice(-2) === '[]') {
    let subtype = type.slice(0, -2)
    return Array.isArray(val) && val.every(a => isInvalid(a, subtype))
  }
  // check if number
  if (type.slice(0, 3) === 'int' || type.slice(0, 4) === 'uint') {
    return vtype === 'number'
  }
  // address type
  if (type === 'address') {
    return isAddress(val)
  }
  // bool type
  if (type === 'bool') {
    return vtype === 'boolean'
  }
  // bytes32 type
  if (type === 'bytes32') {
    return isBytes32(val)
  }
  // string types
  if (type === 'bytes' || type === 'string') {
    return vtype === 'string'
  }
  // tuple types
  if (type === 'tuple') {
    return vtype === 'object'
  }
  // default check against js types
  return vtype === type
}

const mocktract = (address, abi) => {
  let contract = { address, abi, mocktract: true }

  let mockReturnType = {}
  let mockReturnTypes = {
    address: [],
    string: [],
    bool: [],
    uint256: [],
    bytes32: []
  }

  let fakeVal = {
    address: '0x0000000000000000000000000000000000000000',
    string: 'string',
    bool: true,
    uint256: BigNumber(1),
    bytes32: '0x00000000000000000000000000000000000000000000000000000000000000000'
  }

  contract.mockReturnType = (type, value) => {
    mockReturnType[type] = value
  }
  contract.mockReturnTypeOnce = (type, value) => {
    mockReturnTypes[type].push(value)
  }

  const fake = output => {
    let { type } = output

    // ethers tuples are both arrays and object
    if (type === 'tuple') {
      let obj = []
      output.components.forEach((v, i) => {
        let fakeV = fake(v)
        obj[i] = fakeV
        obj[v.name] = fakeV
      })
      return obj
    }

    const match = type.match(/(.+)\[(.+)?\]/)
    if (match) {
      type = match[1]
      len = +match[2] || 1
      return new Array(len).fill(fake({ type }))
    }

    if (fakeVal[type] === undefined) {
      throw Error(`unknown type: ${type} ${JSON.stringify(output)}`)
    }

    if (mockReturnType[type]) {
      return mockReturnType[type]
    } else if (mockReturnTypes[type].length) {
      return mockReturnTypes[type].pop()
    } else {
      return fakeVal[type]
    }
  }

  abi.forEach(item => {
    if (!item.name) return

    if (item.type === 'function') {
      let mockReturnValue
      let mockReturnValues = []

      let fn = function() {
        const args = [...arguments]

        // validate num arguments
        const num = args.length
        const num_expect = item.inputs.length
        if (num !== num_expect) {
          const expected = `Expected ${num_expect} got ${num}`
          throw new Error(`${item.name}: Invalid number of arguments. ${expected}`)
        }

        // validate arguments
        for (const i in args) {
          const arg = args[i]
          const { type } = item.inputs[i]

          if (!isInvalid(arg, type)) {
            throw new Error(`${item.name}: arg ${i} expects type to be ${type}`)
          }
        }

        if (mockReturnValues.length) {
          return mockReturnValues.pop()
        } else if (mockReturnValue !== undefined) {
          return mockReturnValue
        } else {
          let output = item.outputs.map(fake)
          return output.length === 1 ? output[0] : output
        }
      }

      fn.mockReturnValue = function(val) {
        mockReturnValue = val
      }
      fn.mockReturnValueOnce = function(val) {
        mockReturnValues.push(val)
      }

      // return 1 for estimateGas
      fn.estimateGas = function(cb) {
        return 1
      }

      // fake sendTransaction, will validate args and return fake receipt
      fn.sendTransaction = function() {
        const args = [...arguments]

        // if config exists, warn if from address invalid
        if (args[args.length - 1].from !== undefined) {
          const config = args.pop()

          if (!isAddress(config.from))
            console.warn(`${item.name}: sendTransaction from address invalid`)
        }

        // call method for argument validation
        fn(...args)

        // pass 'receipt' to callback
        return fake({ type: 'bytes32' })
      }

      contract[item.name] = fn
    }
  })

  return contract
}

module.exports = mocktract
