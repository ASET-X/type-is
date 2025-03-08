/**
 * @typedef {     "number"
 * | "string"   | "boolean"
 * | "function" | "object"
 * | "bigint"   | "symbol"  } Nativs
 */

const { iterator } = Symbol

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
 * @param {Nativs} type
 * @return {(value: unknown) => value is unknown}
 */
export function makeTypeOfCallback(type) {
  const kind = type || "object"

  return function (value) {
    return ((typeof value) === kind)
  }
}

//#region Definitions

/** @return {value is unknown} */
export function isDefined(value) {
  return (value != null)
}

/** @return {value is void | null} */
export function isEmpty(value) {
  return (value == null)
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

//#region Primitives

/** @return {value is number} */
export function isNumber(value) {
  return (((typeof value) === "number") && isFinite(value))
}

/** @return {value is string} */
export function isString(value) {
  return ((typeof value) === "string")
}

/** @return {value is boolean} */
export function isBoolean(value) {
  return (value === (!!value))
}

/** @return {value is (...args: any) => unknown} */
export function isFunction(value) {
  return ((typeof value) === "function")
}

/** @return {value is object} */
export function isObject(value) {
  return ((value !== null) && ((typeof value) === "object"))
}

//#endregion

//#region Functions

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

//#region Objects

/** @return {value is new (...args: any) => unknown} */
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
 * @param {new (...args: any) => T} constructor
 * @return {target is T}
 */
export function isInstanceOf(target, constructor) {
  return (target instanceof constructor)
}

/**
 * @example
 * ```
 * class A { }
 * class B { }
 * class C extends A { }
 * class D extends C { }
 * 
 * isExtendsOf(A, B) === false
 * isExtendsOf(A, C) === false
 * isExtendsOf(C, B) === false
 * isExtendsOf(D, B) === false
 * 
 * isExtendsOf(C, A) === true
 * isExtendsOf(D, A) === true
 * isExtendsOf(D, C) === true
 * ```
 * 
 * @template T, U
 * @param {new T} Child
 * @param {new U} Parent
 */
export function isExtendsOf(Child, Parent) {
  let current = Child.prototype

  while (current) {
    if (current === Parent.prototype) {
      return true
    }

    current = Object.getPrototypeOf(current)
  }

  return false
}

//#endregion

//#region Iterables

/** @type {(value: unknown) => value is Array<unknown>} */
export const isArray = Array.isArray

/** @return {value is Iterable<unknown>} */
export function isIterable(value) {
  return (isDefined(value) && isFunction(value[iterator]))
}

//#endregion

//#region Numbers

/** @return {value is number} */
export function isInt(value) {
  return isNumber(value) && ((value % 1) === 0)
}

/** @return {value is number} */
export function isFloat(value) {
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

//#region ES6

/** @return {value is symbol} */
export function isSymbol(value) {
  return (
    ((typeof value) === "symbol") ||
    (getConstructorName(value) === "Symbol")
  )
}

/** @return {value is bigint} */
export function isBigInt(value) {
  return (
    ((typeof value) === "bigint") ||
    (getConstructorName(value) === "BigInt")
  )
}

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

//#region JS

/** @return {value is Error} */
export function isError(value) {
  return (value instanceof Error)
}

/** @return {value is RegExp} */
export function isRegExp(value) {
  return (value instanceof RegExp)
}

//#endregion

//#region Unstandard

/** @return {value is Buffer<unknown>} */
export function isBuffer(value) {
  return (
    isDefined(value) &&
    isFunction(value.constructor?.isBuffer) &&
    value.constructor.isBuffer(value)
  )
}

/** @return {value is ArrayLike<unknown>} */
export function isArrayLike(value) {
  return (isDefined(value) && isUInt(value.length))
}

/** @return { value is { x: number, y: number, } } */
export function is2DVectorLike(value) {
  return (
    isDefined(value) &&
    isNumber(value.x) &&
    isNumber(value.y)
  )
}

/** @return { value is { x: number, y: number, z: number, } } */
export function is3DVectorLike(value) {
  return (
    isDefined(value) &&
    isNumber(value.x) &&
    isNumber(value.y) &&
    isNumber(value.z)
  )
}

//#endregion
