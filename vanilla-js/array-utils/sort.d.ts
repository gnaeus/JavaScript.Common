export declare function asc<T>(
  selector?: (item: T) => any
): (left: T, right: T) => number;

export declare function desc<T>(
  selector?: (item: T) => any
): (left: T, right: T) => number;

export declare function by<T>(
  ...comparers: ((left: T, right: T) => number)[]
): (left: T, right: T) => number;
