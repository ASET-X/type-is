/**
 * @typedef {     "number"
 * | "string"   | "boolean"
 * | "function" | "object"
 * | "bigint"   | "symbol"  } NativeTypes
 */

/** @return {string} */
function getObjectName(value) {
  return toString.call(value).slice(8, -1)
}

/** @return {string} */
function getConstructorName(value) {
  return (
    (isDefined(value) && isFunction(value.constructor))
      ? value.constructor.name
      : null
  )
}

/**
 * @param {NativeTypes} type
 * @return {(value: unknown) => value is unknown}
 */
export function makeTypeOfCallback(type) {
  const kind = type || "object"

  return function (value) {
    return ((typeof value) === kind)
  }
}

//#region Defined and Undefined types

/** @return {value is unknown} */
export function isDefined(value) {
  return (value !== null) && (value !== void 0)
}

/** @return {value is void | null} */
export function isEmpty(value) {
  return (value === undefined) || (value === null)
}

/** @return {value is null} */
export function isNull(value) {
  return (value === null)
}

/** @return {value is void} */
export function isUndefined(value) {
  return (value === (void 0))
}

//#endregion

//#region Primitive types

/** @return {value is number} */
export function isNumber(value) {
  return ((typeof value) === "number") && isFinite(value)
}

/** @return {value is string} */
export function isString(value) {
  return (typeof value) === "string"
}

/** @return {value is boolean} */
export function isBoolean(value) {
  return (value === (!!value))
}

/** @return {value is (...args: unknown[]) => unknown} */
export function isFunction(value) {
  return ((typeof value) === "function")
}

/** @return {value is object} */
export function isObject(value) {
  return (value !== null) && ((typeof value) === "object")
}

/** @return {value is symbol} */
export function isSymbol(value) {
  return ((typeof value) === "symbol")
}

/** @return {value is bigint} */
export function isBigInt(value) {
  return ((typeof value) === "bigint")
}

//#endregion

//#region Function types

/** @return {value is GeneratorFunction} */
export function isGenFunc(value) {
  return (
    isFunction(value) &&
    (getConstructorName(value) === "GeneratorFunction")
  )
}

/**
 * @typedef {(event: any) => {then: AsyncFunction, catch : VoidFunction}} AsyncFunction
 */

/** @return {value is (event: any) => Promise<unknown>} */
export function isAsyncFunc(value) {
  return (
    isFunction(value) &&
    (getConstructorName(value) === "AsyncFunction")
  )
}

/** @return {value is ArrayLike<unknown>} */
export function isArguments(value) {
  return (
    isArrayLike(value) &&
    (getObjectName(value) === "Arguments")
  )
}

//#endregion

//#region Object definitions

/** @return {value is new () => unknown} */
export function isClass(value) {
  return (
    isFunction(value) &&
    Function
      .toString
      .call(value)
      .startsWith("class ")
  )
}

export const {
  isExtensible,
} = Reflect

/**
 * @template T
 * @param {unknown} target
 * @param {new (...args: unknown[]) => T} constructor
 * @return {target is T}
 */
export function isInstanceOf(target, constructor) {
  return (target instanceof constructor)
}

/**
 * @template T,U
 * @param {T} subClass
 * @param {U} superClass
 */
export function isExtendOf(subClass, superClass) {
  let current = subClass.prototype

  while (current) {
    if (current === superClass.prototype) {
      return true
    }

    current = Object.getPrototypeOf(current)
  }

  return false
}

//#endregion

//#region Iterable types

/** @type {(value: unknown) => value is Array<unknown>} */
export const isArray = Array.isArray || ((value) => (value instanceof Array));

/** @return {value is ArrayLike<unknown>} */
export function isArrayLike(value) {
  return (isDefined(value) && isUInt(value.length))
}

/** @return {value is Iterable<unknown>} */
export function isIterable(value) {
  return (isDefined(value) && isFunction(value[iterator]))
}

//#endregion

//#region Numbers definitions

/** @return {value is number} */
export function isInt(value) {
  return isNumber(value) && ((value % 1) === 0)
}

/** @return {value is number} */
export function isFloat(params) {
  return isNumber(value) && ((value % 1) !== 0)
}

/** @return {value is number} */
export function isUInt(value) {
  return isInt(value) && (value >= 0)
}

/** @return {value is number} */
export function isUnsigned(value) {
  return isNumber(value) && (value >= 0)
}

/** @return {value is number} */
export function isPositive(value) {
  return isNumber(value) && (value > 0)
}

/** @return {value is number} */
export function isNegative(value) {
  return isNumber(value) && (value < 0)
}

/** @return {value is number} */
export function isSafeInt(value) {
  return isNumber(value) && Number.isSafeInteger(value)
}

/** @return {value is number} */
export function isFiniteNumber(value) {
  return ((typeof value) === "number") && isFinite(value)
}

export function isInfinity(value) {
  return ((value === Infinity) || (value === -Infinity))
}

export function isNotANumber(value) {
  return (value !== value)
}

/** @return {value is (0 | null | undefined | void[] | {})} */
export function isZeroValue(value) {
  return (
    isEmpty(value)
    || (value === 0)
    || (value.length === 0)
    || (Object.keys(value).length === 0)
  )
}

export function isNonZeroValue(value) {
  return !isZeroValue(value)
}

/**
 * @template T, U
 * @param {T} a
 * @param {U} b
 * @return {a is b}
 */
export function isEquals(a, b) {
  if (isNumber(a)) {
    if (a === b) {
      return (1 / a === 1 / b)
    }

    return (a !== a) && (b !== b)
  }
  return (a === b)
}

//#endregion

//#region ES6 Features

/** @return {value is Promise<unknown>} */
export function isPromise(value) {
  return (
    isFunction(value) &&
    (getConstructorName(value) === "Promise")
  )
}

/** @return {value is Map<unknown, unknown>} */
export function isMap(value) {
  return (
    isFunction(value) &&
    (getConstructorName(value) === "Map")
  )
}

/** @return {value is Set<unknown>} */
export function isSet(value) {
  return (
    isFunction(value) &&
    (getConstructorName(value) === "Set")
  )
}

//#endregion

//#region JS Features

/** @return {value is Error} */
export function isError(value) {
  return (value instanceof Error)
}

/** @return {value is RegExp} */
export function isRegExp(value) {
  return (value instanceof RegExp)
}

//#endregion

//#region Unstandard Features

/** @return {value is Buffer<unknown>} */
export function isBuffer(value) {
  return (
    isDefined(value) &&
    isFunction(value.constructor?.isBuffer) &&
    value.constructor.isBuffer(value)
  )
}

//#endregion
