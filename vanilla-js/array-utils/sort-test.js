import { by, asc, desc } from './sort';

const persons = [
  { name: 'John', age: 20 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 20 },
  { name: 'Sara', age: 35 },
  { name: 'Oliver', age: 18 },
  { name: 'Jack', age: 21 },
  { name: 'Olivia', age: 21 },
];

describe('sort by property', () => {
  it('should sort ascending', () => {
    const result = persons
      .slice()
      .sort(asc(p => p.name));

    expect(result).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 20 },
      { name: 'Jack', age: 21 },
      { name: 'John', age: 20 },
      { name: 'Oliver', age: 18 },
      { name: 'Olivia', age: 21 },
      { name: 'Sara', age: 35 },
    ]);
  });

  it('should sort descending', () => {
    const result = persons
      .slice()
      .sort(desc(p => p.name));
      
    expect(result).toEqual([
      { name: 'Sara', age: 35 },
      { name: 'Olivia', age: 21 },
      { name: 'Oliver', age: 18 },
      { name: 'John', age: 20 },
      { name: 'Jack', age: 21 },
      { name: 'Bob', age: 20 },
      { name: 'Alice', age: 25 },
    ]);
  });

  it('should sort in combined order', () => {
    const result = persons
      .slice()
      .sort(by(
        asc(p => p.age),
        desc(p => p.name)
      ));
    
    expect(result).toEqual([
      { name: 'Oliver', age: 18 },
      { name: 'John', age: 20 },
      { name: 'Bob', age: 20 },
      { name: 'Olivia', age: 21 },
      { name: 'Jack', age: 21 },
      { name: 'Alice', age: 25 },
      { name: 'Sara', age: 35 },
    ]);
  });
});

describe('sort by value', () => {
  it('should sort ascending', () => {
    const numbers = [6, 8, 9, 7, 3, 4, 0, 1, 5, 2];

    const result = numbers.sort(asc());

    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should sort descending', () => {
    const numbers = [6, 8, 9, 7, 3, 4, 0, 1, 5, 2];

    const result = numbers.sort(desc());
    
    expect(result).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });
});
