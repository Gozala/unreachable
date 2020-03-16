import { expectError, expectType } from 'tsd'
import unreachable = require('.')

expectType<(value: never) => never>(unreachable)

type Shape =
  | { kind: 'square', size: number }
  | { kind: 'rectangle', width: number, height: number }
  | { kind: 'circle', radius: number }

const area = (shape: Shape): number => {
  switch (shape.kind) {
    case 'square':
      return shape.size * shape.size
    case 'rectangle':
      return shape.height * shape.width
    case 'circle':
      return Math.PI * shape.radius ** 2
    default:
      return unreachable(shape)
  }
}

expectError(area({ kind: 'circl', radius: 7 }))
