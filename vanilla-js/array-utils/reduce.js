/* eslint-disable */
const identity = x => x;

export const distinct = (comparer) => {
  if (typeof comparer === 'undefined') {
    return (result, item) => {
      if (result.lastIndexOf(item) === -1) {
        result.push(item);
      }
      return result;
    };
  }
  return (result, item) => {
    let i = result.length;
    while (i--) {
      if (comparer(result[i], item)) {
        return result;
      }
    }
    result.push(item);
    return result;
  };
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

export const takeWhile = (predicate) => (result, item, i) => {
  if (result.length === i && predicate(item, i)) {
    result.push(item);
  }
  return result;
};

export const skipWhile = (predicate) => (result, item, i) => {
  if (result.length !== 0 || !predicate(item, i)) {
    result.push(item);
  }
  return result;
};
