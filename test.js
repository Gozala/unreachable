const assert = require('assert')
const unreachable = require('.')

assert.strictEqual(typeof unreachable, 'function', 'default export is a function')

assert.throws(
  () => { unreachable({ kind: 'circl', radius: 7 }) },
  new TypeError('Internal error: Encountered impossible value: {"kind":"circl","radius":7}')
)
