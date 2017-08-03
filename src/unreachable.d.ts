export const unreachable = (value: never): never => {
  throw new TypeError(`Internal error: Encountered impossible value: ${value}`)
}

export default unreachable
