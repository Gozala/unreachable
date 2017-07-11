/* @flow */

export default (input: empty): empty => {
  const value = JSON.stringify(input)
  throw new TypeError(
    `Unexpected value ${value}, most likely due to non exhaustive type matching or because call site is not type checked and passed value of incorrect type`
  )
}
