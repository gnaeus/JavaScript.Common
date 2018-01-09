export declare function distinct<T>(): (item: T) => boolean;

export declare function distinctBy<T>(
  selector: (item: T) => any
): (item: T) => boolean;

export declare function distinctWith<T>(
  comparer: (a: T, b: T) => boolean
): (item: T) => boolean;

export declare function takeWhile<T>(
  predicate: (item: T, i: number) => boolean
): (item: T, i: number) => boolean;

export declare function skipWhile<T>(
  predicate: (item: T, i: number) => boolean
): (item: T, i: number) => boolean;
