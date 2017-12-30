export declare function distinct<T>(
  comparer?: (a: T, b: T) => boolean
): (result: T[], item: T) => T[];

export declare function flatten<T>(): (result: T[], item: T[]) => T[];

export declare function groupBy<T, K, U = T>(
  keySelector: ((item: T) => K),
  valueSelector?: ((item: T) => U)
): (result: Grouping<K, U>[], item: T) => Grouping<K, U>[];

export declare function toLookup<T, U = T>(
  keySelector: ((item: T) => number),
  valueSelector?: ((item: T) => U)
): (result: NumberMap<U[]>, item: T) => NumberMap<U[]>;
export declare function toLookup<T, U = T>(
  keySelector: ((item: T) => any),
  valueSelector?: ((item: T) => U)
): (result: StringMap<U[]>, item: T) => StringMap<U[]>;

export declare function toDictionary<T, U = T>(
  keySelector: ((item: T) => number),
  valueSelector?: ((item: T) => U)
): (result: NumberMap<U[]>, item: T) => NumberMap<U[]>;
export declare function toDictionary<T, U = T>(
  keySelector: ((item: T) => any),
  valueSelector?: ((item: T) => U)
): (result: StringMap<U>, item: T) => StringMap<U>;

export declare function maxBy<T>(
  selector: ((item: T) => any)
): (result: T, item: T) => T;

export declare function minBy<T>(
  selector: ((item: T) => any)
): (result: T, item: T) => T;

export declare function takeWhile<T>(
  predicate: ((item: T) => boolean)
): (result: T[], item: T) => T[];

export declare function skipWhile<T>(
  predicate: ((item: T) => boolean)
): (result: T[], item: T) => T[];

interface Grouping<K, T> extends Array<T> {
  readonly key: K;
}

interface NumberMap<T> {
  [key: number]: T;
}

interface StringMap<T> {
  [key: string]: T;
}
