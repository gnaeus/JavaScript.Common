import { denormalize, schema } from "normalizr";

/**
 * Denormalize all entities.
 * @param {Object} entities Normalized entities
 * @param {schema.Entity[]} entitySchemas Entity schemas
 * @example
 * const { entities } = normalize(user, Post);
 * const tables = denormalizeEntities(entities, [User, Post, Comment]);
 */
export function denormalizeEntities(entities, entitySchemas) {
  const tablesSchema = {};
  const tablesData = {};

  entitySchemas.forEach(entitySchema => {
    tablesSchema[entitySchema.key] = new schema.Values(entitySchema);

    tablesData[entitySchema.key] = Object.keys(
      entities[entitySchema.key] || {}
    ).reduce((obj, id) => ((obj[id] = id), obj), {});
  });

  // @ts-ignore
  return denormalize(tablesData, tablesSchema, entities);
}
