/**
 * Deep merge two objects with structural sharing of unchanged parts.
 */
export function structuralMerge(left, right) {
  if (left === right) {
    return right;
  }
  if (isPlainObject(right)) {
    if (!isPlainObject(left)) {
      return right;
    }
    const result = {};
    for (const key in left) {
      result[key] = null;
    }
    for (const key in right) {
      result[key] = null;
    }
    for (const key in result) {
      result[key] = structuralMerge(left[key], right[key]);
    }
    return result;
  }
  if (Array.isArray(right)) {
    if (!Array.isArray(left)) {
      return right;
    }
    const result = [];
    const length = Math.max(left.length, right.length);
    for (let i = 0; i < length; i++) {
      result[i] = structuralMerge(left[i], right[i]);
    }
    return result;
  }
  if (right != null || typeof left === "undefined") {
    return right;
  }
  return left;
}

function isPlainObject(arg) {
  if (arg && typeof arg === "object" && !Array.isArray(arg)) {
    const prototype = Object.getPrototypeOf(arg);
    return prototype === Object.prototype || prototype === null;
  }
  return false;
}
