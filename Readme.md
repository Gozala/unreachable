# unreachable
[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]



Utility function for exhaustiveness checking with (typed) JS (Be it [TypeScript][] or [Flow][])

## Problem

### Exhaustiveness checking for Tagged Unions

[Tagged unions][] are present in both in Flow reffered as [Disjoint Unions][] and in TypeScript referred as [Discriminated Unions][]. Unfortunately both utilize [JS switch statements][switch] for pattern matching that comes with inherent limitations.

Consider following example that is both flow & typescript code:

```js
type Shape =
  | { kind: "square", size: number }
  | { kind: "rectangle", width: number, height: number }
  | { kind: "circle", radius: number }

const area = (shape: Shape):number => {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size
    case "rectangle":
      return shape.height * shape.width
    case "circle":
      return Math.PI * shape.radius ** 2
  }
}
```

### Exhaustiveness problem (Flow)

As of this writing Flow (0.49.1) [fails to typecheck][flow example] as it's still unable to [detect exhaustive type refinements][flow exhaustiveness bug] and there requires `default` case:

```js
/* @flow */

type Shape =
  | { kind: "square", size: number }
  | { kind: "rectangle", width: number, height: number }
  | { kind: "circle", radius: number }

const area = (shape: Shape):number => {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size
    case "rectangle":
      return shape.height * shape.width
    case "circle":
      return Math.PI * shape.radius ** 2
    default:
      throw new TypeError(`Unsupported shape was passed: ${JSON.stringify(shape)}`)
  }
}
```

But that is not ideal as type checker will no longer be able to catch errors if we add variant to our `Shape` union:

```js
type Shape =
  | { kind: "square", size: number }
  | { kind: "rectangle", width: number, height: number }
  | { kind: "circle", radius: number }
  | { kind: "triangle", a:number, b:number, c:number } // <- added variant
```

Last version of `area` function will still type check and accept triangles but type checker will not be able to report an error instead we'll get one at runtime.

### JS call site problem

As of this writing TypeScript (2.4) with `strictNullChecks` has a proper [exhaustiveness checking][] support and there for is free of the [Exhaustiveness problem][#Exhaustiveness_problem_flow] & original code type checkes fine, it also will not type check if more variants are added to `Shape` union and unless `area` funciton is also modified to handle that.

Still original code is not ideal if call site (of `area`) function is not type checked, if say call site is JS like code below:

```js
area({ kind:"circl", radius:7 }) // => undefined
```

There will be no erros reported by `area` function it will just return `undefined` instead of `number` and likely causing error down the line that is harded to track down. And that is where this library can help, in fact it just provides a function that [TypeScript Handbook][ts exhaustiveness] recommends as a good practice.

## Solution

This library provides default export function that takes single argument of the [bottom type][], which denotes type of the value that can never occur and throws a `TypeError` with helpful message when invoked. In TypeScript it is referred as `never` and in Flow it (is not yet documented, but) is referred as `empty`.

```js
import unreachable from "unreachable"

type Shape =
  | { kind: "square", size: number }
  | { kind: "rectangle", width: number, height: number }
  | { kind: "circle", radius: number }

const area = (shape: Shape):number => {
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
```

Above code type checks both in Flow and TypeScript. While following code does not type check:

```js
import unreachable from "unreachable"

type Shape =
  | { kind: "square", size: number }
  | { kind: "rectangle", width: number, height: number }
  | { kind: "circle", radius: number }
  | { kind: "triangle", a:number, b:number, c:number } // <- Added variant

const area = (shape: Shape):number => {
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
```

Flow will report that `shape:Shape` is incompatible with expected `empty` type. TypeScript will report that `{ kind: "triangle"; a: number; b: number; c: number; }` is incompatible with `never`.

Obviously type checker won't help with incorrect call from JS call site, but at least it will throw an exception from the `shape` function with helpful message and stack trace leading to the source of the error:

```js
area({ kind:"circl", radius:7 })
//> TypeError('Internal error: Encountered impossible value: { kind:"circl", radius:7 }')
```


## Install

    npm install unreachable

## Prior Art

Somewhat inspired by Rust [unreachable][] macro.


[unreachable]:https://doc.rust-lang.org/std/macro.unreachable.html
[TypeScript]:http://typescriptlang.org/
[Flow]:https://flow.org/
[Discriminated Unions]:https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
[Disjoint Unions]:https://flow.org/en/docs/types/unions/#toc-disjoint-unions
[Tagged unions]:https://en.wikipedia.org/wiki/Tagged_union
[switch]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
[flow example]:https://flow.org/try/#0PQKgBAAgZgNg9gdzCYAoVAXAngBwKZgDKAFgIb5gC8qYYAPmAN5gDWAlgHYAmAXGAEQBnAI4BXUgCc8-ADRhBbAF54+HUQFsARnglgAvjXpNWnXgKkBjDKQ4BzGNLkI2XDMVUbtEucTxtbxBgeWjr6hgzM7Nx8-BZsEhYOsmASpFxsooLBXmGoFnAcghhgknikVGAAFIJk+Hwk5HgAlDxqIbqUAHxMhoLOGBbEVTWNAHRRXE09tLQWpIIEQmKl-DyGMyl4GKISHPK1eKMKysj7Y8d462BzC+Z4Vjb20msbtFLbu2f4o77+gacjb7OVzEK43RZxBJJF6vd47PYAWVIblGAAUAJIAg6jVLpTLIcAAJkMBj0QA
[flow exhaustiveness bug]:https://github.com/facebook/flow/issues/1835
[ts exhaustiveness]:https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
[bottom type]:https://en.wikipedia.org/wiki/Bottom_type

[travis.icon]: https://travis-ci.org/Gozala/unreachable.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/unreachable

[version.icon]: https://img.shields.io/npm/v/unreachable.svg
[downloads.icon]: https://img.shields.io/npm/dm/unreachable.svg
[package.url]: https://npmjs.org/package/unreachable


[downloads.image]: https://img.shields.io/npm/dm/unreachable.svg
[downloads.url]: https://npmjs.org/package/unreachable

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier