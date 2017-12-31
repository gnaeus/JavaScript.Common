/* eslint-disable */
const identity = x => x;

export const distinct = () => (result, item) => {
  if (result.lastIndexOf(item) === -1) {
    result.push(item);
  }
  return result;
};

export const distinctBy = (selector) => {
  const keys = [];
  return (result, item) => {
    const key = selector(item);
    if (keys.lastIndexOf(key) === -1) {
      keys.push(key);
      result.push(item);
    }
    return result;
  }
};

export const distinctWith = (comparer) => (result, item) => {
  let i = result.length;
  while (i--) {
    if (comparer(result[i], item)) {
      return result;
    }
  }
  result.push(item);
  return result;
};

export const flatten = () => (result, item) => {
  result.push(...item);
  return result;
};

export const groupBy = (keySelector, valueSelector = identity) => {
  const hashTable = Object.create(null);

  return (result, item) => {
    const key = keySelector(item);
    const value = valueSelector(item);

    const bucket = hashTable[key] || (hashTable[key] = []);

    let group;
    let i = bucket.length;
    while (i--) {
      group = bucket[i];
      if (group.key === key) {
        break;
      }
    }
    if (i === -1) {
      group = [value];
      Object.defineProperty(group, 'key', { value: key });
      bucket.push(group);
      result.push(group);
    } else {
      group.push(value);
    }

    return result;
  };
};

export const toLookup = (keySelector, valueSelector = identity) => (result, item) => {
  const key = keySelector(item);
  const value = valueSelector(item);
  if (Object.prototype.hasOwnProperty.call(result, key)) {
    result[key].push(value);
  } else {
    result[key] = [value];
  }
  return result;
};

export const toDictionary = (keySelector, valueSelector = identity) => (result, item) => {
  const key = keySelector(item);
  const value = valueSelector(item);
  result[key] = value;
  return result;
};

export const maxBy = (selector) => {
  let max;
  return (result, item) => {
    const value = selector(item);
    if (max >= value) {
      return result;
    }
    max = value;
    return item;
  }
}

export const minBy = (selector) => {
  let min;
  return (result, item) => {
    const value = selector(item);
    if (min <= value) {
      return result;
    }
    min = value;
    return item;
  }
}

export const takeWhile = (predicate) => (result, item, i) => {
  if (result.length === i && predicate(item, i)) {
    result.push(item);
  }
  return result;
};

export const skipWhile = (predicate) => (result, item, i) => {
  if (result.length > 0 || !predicate(item, i)) {
    result.push(item);
  }
  return result;
};
