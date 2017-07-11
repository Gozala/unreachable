export const corrupt = (value:never):never => {
  throw new TypeError(`Unexpected value ${value}, most likely due to non exhaustive type matching or because call site is not type checked and passed value of incorrect type`)
}

export default corrupt