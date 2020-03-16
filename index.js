// @flow

module.exports = function unreachable (value /*: empty */) /*: empty */ {
  throw new TypeError('Internal error: Encountered impossible value: ' + JSON.stringify(value))
}
