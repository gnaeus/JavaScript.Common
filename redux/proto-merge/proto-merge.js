/**
 * Speedup Redux normalized state 'byId' object transformation
 */
export function protoMerge(source, changes, mergeThreshold = 100) {
  let result;
  const proto = Object.getPrototypeOf(source);

  if (proto === Object.prototype || proto === null) {
    // если source создан как object literal - то просто наследуемся от него
    result = Object.create(source);
  } else {
    const sourceKeys = Object.keys(source);
    const sourceLength = sourceKeys.length;

    if (sourceLength < mergeThreshold) {
      result = Object.create(proto);
      // если размер объекта source меньше порогового значения
      // - копируем только собственные свойства объекта source
      for (let i = 0; i < sourceLength; i++) {
        const key = sourceKeys[i];
        result[key] = source[key];
      }
    } else {
      result = {};
      // иначе - копируем все перечисляемые свойства
      // объекта source и его прототипа
      for (const key in source) {
        const value = source[key];
        // удаляем "пустые" свойства
        if (typeof value !== "undefined") {
          result[key] = value;
        }
      }
    }
  }
  // копируем все перечисляемые свойства объекта changes
  for (const key in changes) {
    result[key] = changes[key];
  }
  return result;
}
