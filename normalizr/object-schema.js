// @ts-nocheck
import { schema } from "normalizr";

/**
 * `schema.Object` that preserves `null` in property values
 * https://github.com/paularmstrong/normalizr/issues/332
 */
schema.Object.prototype.normalize = function(
  input,
  _parent,
  _key,
  visit,
  addEntity
) {
  const object = { ...input };
  Object.keys(this.schema).forEach(key => {
    const localSchema = this.schema[key];
    const value = visit(input[key], input, key, localSchema, addEntity);
    if (value === undefined) {
      delete object[key];
    } else {
      object[key] = value;
    }
  });
  return object;
};
