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

export const by = (...comparers) => (left, right) => {
  const length = comparers.length;
  for (let i = 0; i < length; i++) {
    const num = comparers[i](left, right);
    if (num) {
      return num;
    }
  }
  return 0;
}
