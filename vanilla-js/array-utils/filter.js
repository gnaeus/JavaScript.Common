export const distinct = () => {
  const keys = [];
  return (item) => {
    if (keys.lastIndexOf(item) !== -1) {
      return false;
    }
    keys.push(item);
    return true;
  };
};

export const distinctBy = (selector) => {
  const keys = [];
  return (item) => {
    const key = selector(item);
    if (keys.lastIndexOf(key) !== -1) {
      return false;
    }
    keys.push(key);
    return true;
  };
};

export const distinctWith = (comparer) => {
  const keys = [];
  return (item) => {
    let i = keys.length;
    while (i--) {
      if (comparer(keys[i], item)) {
        return false;
      }
    }
    keys.push(item);
    return true;
  };
};

export const takeWhile = (predicate) => {
  let shouldTake = true;
  return (item, i) => shouldTake && (shouldTake = predicate(item, i));
};

export const skipWhile = (predicate) => {
  let shouldTake = false;
  return (item, i) => shouldTake || (shouldTake = !predicate(item, i));
};
