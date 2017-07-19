interface KnockoutStatic {
  /**
   * Update target object from source object with automatic ko.observable mapping.
   * Use only with flat objects. For more complex structures please use ko.mapping plugin.
   */
  mergeJS(target: Object, source: Object, options?: {
    exclude?: string[];
  }): Object;
}