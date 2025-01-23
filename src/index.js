import * as types from "./typeis.js"
export * from "./typeis.js"

/** @param {unknown} value */
export function typeis(value) {
  if (types.isNull(value)) return "null"
  if (types.isArray(value)) return "array"

  return typeof value
}

/** @type {{ }} */
const _ = Object.create(null)

export const is = Object.assign(_, {
  arr: types.isArray,
  array: types.isArray,
  arrayLike: types.isArrayLike,
  bigint: types.isBigInt,
  boolean: types.isBoolean,
  defined: types.isDefined,
  empty: types.isEmpty,
  func: types.isFunction,
  iterable: types.isIterable,
  null: types.isNull,
  num: types.isNumber,
  obj: types.isObject,
  str: types.isString,
  symbol: types.isSymbol,
  undefined: types.isUndefined,

  toString: Object.prototype.toString
})
