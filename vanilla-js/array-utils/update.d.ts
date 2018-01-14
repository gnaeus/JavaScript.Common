/**
 * Updates the array of some class instances from
 * an array of some plain objects with matching keys.
 */
export declare function update<T>(entities: T[]): {
  from<M = T>(models: M[]): {
    withKeys<K>(
      entityKeySelector: (entity: T, index: number) => K,
      modelKeySelector?: (model: M, index: number) => K,
    ): {
        mapValues(mapModelToEntity: (entity: T, model: M) => T): void;
      }
  }
}
