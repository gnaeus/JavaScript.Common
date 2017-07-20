interface Array<T> {
  /**
   * Splits a collection into sets, grouped by the result of running each value through keySelector.
   * The order of grouped values is determined by the order they occur in collection.
   * @param keySelector The function to get key from each element.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * keySelector. If it is not provided, undefined is used instead.
   */
  groupBy<K>(keySelector: (value: T, index: number, array: T[]) => K, thisArg?: any): Grouping<K, T>[];

  /**
   * Returns a sorted copy of list, ranked in ascending order by the results of running each value
   * through keySelector. The order of grouped values is determined by the order they occur in collection.
   * @param keySelector The function to get key from each element.
   * @param sortOrder "asc" | "desc" (default "asc").
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * keySelector. If it is not provided, undefined is used instead.
   */
  orderBy(keySelector: (value: T, index: number, array: T[]) => any, sortOrder?: "asc" | "desc", thisArg?: any): T[];

  /**
   * Converts a collection to object, where keys are results of running each value through keySelector
   * and values are elements of collection. The order of keys is determined by the order they occur in collection.
   * @param keySelector The function to get key from each element.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * keySelector. If it is not provided, undefined is used instead.
   */
  toDictionary(keySelector: (value: T, index: number, array: T[]) => number, thisArg?: any): NumberMap<T>;
  toDictionary(keySelector: (value: T, index: number, array: T[]) => any, thisArg?: any): StringMap<T>;

  /**
   * Converts a collection to object, where keys are results of running each value through keySelector
   * and values are sets of elements, grouped by the key.
   * The order of keys is determined by the order they occur in collection.
   * @param keySelector The function to get key from each element.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * keySelector. If it is not provided, undefined is used instead.
   */
  toLookup(keySelector: (value: T, index: number, array: T[]) => number, thisArg?: any): NumberMap<T[]>;
  toLookup(keySelector: (value: T, index: number, array: T[]) => any, thisArg?: any): StringMap<T[]>;

  /**
   * Updates the array of some class instances from an array of some plain objects with matching keys.
   */
  updateFrom<M>(models: M[]): {
    withKeys<K>(
      modelKeySelector: (model: M, index: number) => K,
      entityKeySelector: (entity: T, index: number) => K,
    ): {
      mapValues(mapModelToEntity: (model: M, entity: T) => T): void;
    };
  }
}

interface Grouping<K, T> extends Array<T> {
  readonly key: K;
}

interface NumberMap<T> {
  [key: number]: T;
}

interface StringMap<T> {
  [key: string]: T;
}
