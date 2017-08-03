/* @flow */

export const unreachable = (value: empty): empty => {
  const format = JSON.stringify(value)
  throw new TypeError(`Internal error: Encountered impossible value: ${format}`)
}

export default unreachable
