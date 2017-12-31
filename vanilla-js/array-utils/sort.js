/* eslint-disable */

export const asc = (selector) => {
  if (typeof selector === 'undefined') {
    return (l, r) => l < r ? -1 : l > r ? 1 : 0;
  }
  return (left, right) => {
    const l = selector(left);
    const r = selector(right);
    return l < r ? -1 : l > r ? 1 : 0
  };
};

export const desc = (selector) => {
  if (typeof selector === 'undefined') {
    return (l, r) => l < r ? 1 : l > r ? -1 : 0;
  }
  return (left, right) => {
    const l = selector(left);
    const r = selector(right);
    return l < r ? 1 : l > r ? -1 : 0;
  };
};

export const by = (...comparers) => {
  const [first, second, third] = comparers;

  switch (comparers.length) {
    case 1:
      return first;
    case 2:
      return (left, right) => first(left, right) || second(left, right);
    case 3:
      return (left, right) =>
        first(left, right) || second(left, right) || third(left, right);
  }

  return (left, right) => {
    const length = comparers.length
    for (let i = 0; i < length; i++) {
      const num = comparers[i](left, right);
      if (num) {
        return num;
      }
    }
    return 0;
  };
};

