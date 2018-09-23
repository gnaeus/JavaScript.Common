export default function(fieldName, getTable) {
  const weakMap = new WeakMap();

  return function(state, entity) {
    return entity ? selector(entity) : selector;

    function selector(entity) {
      const fieldValue = entity[fieldName];
      if (fieldValue == null) {
        return fieldValue;
      }

      const table = getTable(state);
      if (typeof fieldValue !== "object") {
        return table[fieldValue];
      }

      let cacheEntry = weakMap.get(fieldValue);
      if (!cacheEntry) {
        cacheEntry = { table: null, value: null };
        weakMap.set(fieldValue, cacheEntry);
      }

      if (cacheEntry.table === table) {
        return cacheEntry.value;
      }
      cacheEntry.table = table;

      if (Array.isArray(fieldValue)) {
        cacheEntry.value = fieldValue.map(id => table[id]);
      } else {
        const dict = {};
        for (const key in fieldValue) {
          dict[key] = table[fieldValue[key]];
        }
        cacheEntry.value = dict;
      }

      return cacheEntry.value;
    }
  };
}
