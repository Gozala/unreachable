/* @flow */

import corrupt from "../"
import test from "blue-tape"

test("baisc", async test => {
  test.isEqual(typeof corrupt, "function", "default export is a function")

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
        return corrupt(shape)
    }
  }

  test.throws(() => {
    area(({ kind: "circl", radius: 7 }: any))
  }, TypeError('Unexpected value { kind:"circl", radius:7 }, most likely due to non exhaustive type matching or because call site is not type checked and passed value of incorrect type'))
})
