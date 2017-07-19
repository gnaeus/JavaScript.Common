/**
 * 32-bit hash of string. If string contains number it returns this number
 */
export function hash(str) {
  const type = typeof str;
  if (type === "number") {
    return str;
  }
  if (type !== "string") {
    str += "";
  }
  // test for UInt32 by regex
  if (/^(0|[1-9]\d*)$/.test(str)) {
    return +str;
  }
  // or try cast to Number to UInt32 and then compare
  const num = +str;
  const int = num >>> 0;
  if (num === int) {
    return int;
  }

  let hash = 0;
  for (let i = 0, len = str.length; i < len; ++i) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash + c) | 0;
  }
  return hash;
}
