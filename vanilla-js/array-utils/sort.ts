/**
 * Creates a comparsion function for Array `.sort()` that:
 * Compares values returned by selector function in ascending order.
 */
export const asc = <T>(selector?: (item: T) => any) => {
  if (typeof selector === "undefined") {
    return (l: T, r: T) => (l < r ? -1 : l > r ? 1 : 0);
  }
  return (left: T, right: T) => {
    const l = selector(left);
    const r = selector(right);
    return l < r ? -1 : l > r ? 1 : 0;
  };
};

/**
 * Creates a comparsion function for Array `.sort()` that:
 * Compares values returned by selector function in descending order.
 */
export const desc = <T>(selector?: (item: T) => any) => {
  if (typeof selector === "undefined") {
    return (l: T, r: T) => (l < r ? 1 : l > r ? -1 : 0);
  }
  return (left: T, right: T) => {
    const l = selector(left);
    const r = selector(right);
    return l < r ? 1 : l > r ? -1 : 0;
  };
};

/**
 * Creates a comparsion function for Array `.sort()` that:
 * Combines multiple other comparsion functions.
 */
export const by = <T>(...comparers: ((left: T, right: T) => number)[]) => {
  const [first, second, third] = comparers;

  switch (comparers.length) {
    case 1:
      return first;
    case 2:
      return (left: T, right: T) => first(left, right) || second(left, right);
    case 3:
      return (left: T, right: T) => first(left, right) || second(left, right) || third(left, right);
  }

  return (left: T, right: T) => {
    const length = comparers.length;
    for (let i = 0; i < length; i++) {
      const num = comparers[i](left, right);
      if (num) {
        return num;
      }
    }
    return 0;
  };
};
