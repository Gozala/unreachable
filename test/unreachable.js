/* @flow */

import unreachable from "../"
import test from "blue-tape"

test("baisc", async test => {
  test.isEqual(typeof unreachable, "function", "default export is a function")

  type Shape =
    | { kind: "square", size: number }
    | { kind: "rectangle", width: number, height: number }
    | { kind: "circle", radius: number }

  const area = (shape: Shape): number => {
    switch (shape.kind) {
      case "square":
        return shape.size * shape.size
      case "rectangle":
        return shape.height * shape.width
      case "circle":
        return Math.PI * shape.radius ** 2
      default:
        return unreachable(shape)
    }
  }

  test.throws(() => {
    area(({ kind: "circl", radius: 7 }: any))
  }, TypeError('Internal error: Encountered impossible value: { kind:"circl", radius:7 }'))
})
