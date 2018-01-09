import { distinctBy } from './filter';
import {
  flatten,
  groupBy,
  toLookup,
  toDictionary,
  maxBy,
  minBy,
} from './reduce';

const persons = [
  { name: 'John', age: 20 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 20 },
  { name: 'Sara', age: 35 },
  { name: 'Oliver', age: 18 },
  { name: 'Jack', age: 21 },
  { name: 'Olivia', age: 21 },
];

describe('flatten', () => {
  it('should make flat array', () => {
    const array = [
      [1, 2, 3],
      [4, 5],
      [6]
    ];

    const result = array.reduce(flatten(), []);

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('groupBy', () => {
  it('should group objects by property', () => {
    const result = persons
      .reduce(groupBy(p => p.age), []);

    expect(result.map(g => g.key)).toEqual([20, 25, 35, 18, 21]);

    expect(result).toEqual([
      [
        { name: 'John', age: 20 },
        { name: 'Bob', age: 20 },
      ],
      [
        { name: 'Alice', age: 25 },
      ],
      [
        { name: 'Sara', age: 35 },
      ],
      [
        { name: 'Oliver', age: 18 },
      ],
      [
        { name: 'Jack', age: 21 },
        { name: 'Olivia', age: 21 },
      ],
    ]);
  });

  it('should use value selector', () => {
    const result = persons
      .reduce(groupBy(p => p.age, p => p.name), []);

    expect(result.map(g => g.key)).toEqual([20, 25, 35, 18, 21]);

    expect(result).toEqual([
      ['John', 'Bob'],
      ['Alice'],
      ['Sara'],
      ['Oliver'],
      ['Jack', 'Olivia'],
    ]);
  });
});

describe('toLookup', () => {
  it('should group objects by property', () => {
    const result = persons
      .reduce(toLookup(p => p.age), {});

    expect(result).toEqual({
      20: [
        { name: 'John', age: 20 },
        { name: 'Bob', age: 20 },
      ],
      25: [
        { name: 'Alice', age: 25 },
      ],
      35: [
        { name: 'Sara', age: 35 },
      ],
      18: [
        { name: 'Oliver', age: 18 },
      ],
      21: [
        { name: 'Jack', age: 21 },
        { name: 'Olivia', age: 21 },
      ],
    });
  });

  it('should use value selector', () => {
    const result = persons
      .reduce(toLookup(p => p.age, p => p.name), {});

    expect(result).toEqual({
      20: ['John', 'Bob'],
      25: ['Alice'],
      35: ['Sara'],
      18: ['Oliver'],
      21: ['Jack', 'Olivia'],
    });
  });
});

describe('toDictionary', () => {
  it('should group objects by property', () => {
    const result = persons
      .filter(distinctBy(p => p.age))
      .reduce(toDictionary(p => p.age), {});

    expect(result).toEqual({
      20: { name: 'John', age: 20 },
      25: { name: 'Alice', age: 25 },
      35: { name: 'Sara', age: 35 },
      18: { name: 'Oliver', age: 18 },
      21: { name: 'Jack', age: 21 },
    });
  });

  it('should use value selector', () => {
    const result = persons
      .filter(distinctBy(p => p.age))
      .reduce(toDictionary(p => p.age, p => p.name), {});

    expect(result).toEqual({
      20: 'John',
      25: 'Alice',
      35: 'Sara',
      18: 'Oliver',
      21: 'Jack',
    });
  });
});

describe('maxBy', () => {
  it('should find object with max numeric property', () => {
    const result = persons.reduce(maxBy(p => p.age), null);

    expect(result).toEqual({ name: 'Sara', age: 35 });
  });

  it('should find object with max string property', () => {
    const result = persons.reduce(maxBy(p => p.name), null);

    expect(result).toEqual({ name: 'Sara', age: 35 });
  });

  it('should work without initial value', () => {
    const result = persons.reduce(maxBy(p => p.name));

    expect(result).toEqual({ name: 'Sara', age: 35 });
  });

  it('should use initial value when array is empty', () => {
    const result = [].reduce(maxBy(p => p.name), { name: '', age: 0 });

    expect(result).toEqual({ name: '', age: 0 });
  });
});

describe('minBy', () => {
  it('should find object with min numeric property', () => {
    const result = persons.reduce(minBy(p => p.age), null);

    expect(result).toEqual({ name: 'Oliver', age: 18 });
  });

  it('should find object with min string property', () => {
    const result = persons.reduce(minBy(p => p.name), null);

    expect(result).toEqual({ name: 'Alice', age: 25 });
  });

  it('should work without initial value', () => {
    const result = persons.reduce(minBy(p => p.name));

    expect(result).toEqual({ name: 'Alice', age: 25 });
  });

  it('should use initial value when array is empty', () => {
    const result = [].reduce(minBy(p => p.name), { name: '', age: 0 });

    expect(result).toEqual({ name: '', age: 0 });
  });
});
