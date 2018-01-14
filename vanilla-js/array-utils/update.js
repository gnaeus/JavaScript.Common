/**
 * Updates the array of some class instances from
 * an array of some plain objects with matching keys.
 */
export function update(entities) {
  return {
    from(models) {
      // eslint-disable-next-line eqeqeq
      if (models == null) {
        models = [];
      }
      return {
        withKeys(entityKeySelector, modelKeySelector = entityKeySelector) {
          return {
            mapValues(mapModelToEntity) {
              const entityLookup = Object.create(null);

              const entitiesLength = entities.length;
              for (let i = 0; i < entitiesLength; i++) {
                const entity = entities[i];
                const key = entityKeySelector(entity, i);
                entityLookup[key] = entity;
              }

              entities.length = 0;

              const modelsLength = models.length;
              for (let i = 0; i < modelsLength; i++) {
                const model = models[i];
                const key = modelKeySelector(model, i);
                const entity = entityLookup[key];

                entities.push(mapModelToEntity(entity, model));
              }

              return entities;
            }
          }
        }
      }
    }
  }
}
