import { update } from './update';

describe('update', () => {
  class Entity {
    id = 0;
    value = null;
  }

  it('should update entities from models', () => {
    const entity1 = new Entity();
    entity1.id = 1;
    entity1.value = 'first';

    const entity2 = new Entity();
    entity2.id = 2;
    entity2.value = 'second';

    const entities = [entity1, entity2];

    const models = [
      { id: 1, value: 'FIRST' },
      { id: 3, value: 'THIRD' },
    ];

    update(entities)
      .from(models)
      .withKeys(e => e.id, m => m.id)
      .mapValues((e = new Entity(), m) => {
        e.id = m.id;
        e.value = m.value;
        return e;
      });

    expect(entities.length).toEqual(2);

    expect(entities[0]).toBe(entity1);
    expect(entities[0].id).toEqual(1);
    expect(entities[0].value).toEqual('FIRST');

    expect(entities[1]).not.toBe(entity2);
    expect(entities[1].id).toEqual(3);
    expect(entities[1].value).toEqual('THIRD');
  });
});
