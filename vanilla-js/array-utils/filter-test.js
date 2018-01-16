import { 
  distinct,
  distinctBy,
  distinctWith,
  without,
  takeWhile,
  skipWhile,
} from './filter';

const persons = [
  { name: 'John', age: 20 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 20 },
  { name: 'Sara', age: 35 },
  { name: 'Oliver', age: 18 },
  { name: 'Jack', age: 21 },
  { name: 'Olivia', age: 21 },
];

/**
 * @template T
 * @param {() => T} callback 
 * @returns {T}
 */
function es5(callback) {
  const map = Map;
  const set = Set;
  Map = undefined;
  Set = undefined;
  const result = callback();
  Map = map;
  Set = set;
  return result;
}

describe('distinct by value', () => {
  it('should omit repeated values', () => {
    const numbers = [2, 1, 4, 4, 2, 3, 1];

    const result = numbers.filter(distinct());

    expect(result).toEqual([2, 1, 4, 3]);
  });

  it('should omit repeated values (ES5)', () => {
    const numbers = [2, 1, 4, 4, 2, 3, 1];

    const result = es5(() => numbers.filter(distinct()));

    expect(result).toEqual([2, 1, 4, 3]);
  });
});

describe('distinct by property', () => {
  it('should omit repeated values', () => {
    const result = persons
      .filter(distinctBy(p => p.age));

    expect(result).toEqual([
      { name: 'John', age: 20 },
      { name: 'Alice', age: 25 },
      { name: 'Sara', age: 35 },
      { name: 'Oliver', age: 18 },
      { name: 'Jack', age: 21 },
    ]);
  });

  it('should omit repeated values (ES5)', () => {
    const result = es5(() => persons
      .filter(distinctBy(p => p.age)));

    expect(result).toEqual([
      { name: 'John', age: 20 },
      { name: 'Alice', age: 25 },
      { name: 'Sara', age: 35 },
      { name: 'Oliver', age: 18 },
      { name: 'Jack', age: 21 },
    ]);
  });
});

describe('distinct with comparer', () => {
  it('should omit repeated values', () => {
    const result = persons
      .filter(distinctWith((a, b) => a.age === b.age));

    expect(result).toEqual([
      { name: 'John', age: 20 },
      { name: 'Alice', age: 25 },
      { name: 'Sara', age: 35 },
      { name: 'Oliver', age: 18 },
      { name: 'Jack', age: 21 },
    ]);
  });
});

describe('without', () => {
  it('shoult omit passed values', () => {
    const numbers = [2, 1, 4, 4, 2, 3, 1];

    const result = numbers.filter(without([1, 2]));

    expect(result).toEqual([4, 4, 3]);
  });

  it('shoult omit passed values (ES5)', () => {
    const numbers = [2, 1, 4, 4, 2, 3, 1];

    const result = es5(() => numbers.filter(without([1, 2])));

    expect(result).toEqual([4, 4, 3]);
  });
});

describe('takeWhile', () => {
  it('should copy sequence while predicate is true', () => {
    const result = persons
      .filter(takeWhile(p => p.age < 30));
    
    expect(result).toEqual([
      { name: 'John', age: 20 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 20 },
    ]);
  });

  it('should use array index in predicate', () => {
    const result = persons
      .filter(takeWhile((p, i) => p.age < 30 && i < 2));
    
    expect(result).toEqual([
      { name: 'John', age: 20 },
      { name: 'Alice', age: 25 },
    ]);
  });
});

describe('skipWhile', () => {
  it('should skip sequence while predicate is true', () => {
    const result = persons
      .filter(skipWhile(p => p.age < 30));
    
    expect(result).toEqual([
      { name: 'Sara', age: 35 },
      { name: 'Oliver', age: 18 },
      { name: 'Jack', age: 21 },
      { name: 'Olivia', age: 21 },
    ]);
  });

  it('should use array index in predicate', () => {
    const result = persons
      .filter(skipWhile((p, i) => p.age < 30 && i < 2));
    
    expect(result).toEqual([
      { name: 'Bob', age: 20 },
      { name: 'Sara', age: 35 },
      { name: 'Oliver', age: 18 },
      { name: 'Jack', age: 21 },
      { name: 'Olivia', age: 21 },
    ]);
  });
});
