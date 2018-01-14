# Utils for enhancing builtin Array methods

### Array.prototype.filter
* [distinct](#distinct)
* [distinctBy](#distinctBy)
* [distinctWith](#distinctWith)
* [takeWhile](#takeWhile)
* [skipWhile](#skipWhile)

### Array.prototype.reduce
* [flatten](#flatten)
* [groupBy](#groupBy)
* [toLookup](#toLookup)
* [toDictionary](#toDictionary)
* [maxBy](#maxBy)
* [minBy](#minBy)

### Array.prototype.sort
* [asc](#asc)
* [desc](#desc)
* [by](#by)

### [Update Array](#update)

<br>

## Array.prototype.filter

### <a name="distinct"></a> distinct
Creates a predicate function for Array `.filter()` to:
Create a duplicate-free version of an array,
in which only the first occurrence of each element is kept.

```js
import { distinct } from './filter';

const arr = [1, 2, 3, 1, 2];

const res = arr.filter(distinct());
// res -> [1, 2, 3];
```
### <a name="distinctBy"></a> distinctBy
Creates a predicate function for Array `.filter()` to:
Create a duplicate-free version of an array, using value returned by selector function
for equality comparisons, in which only the first occurrence of each element is kept.

```js
import { distinctBy } from './filter';

const arr = [
  { id: 1, name: 'first' },
  { id: 2, name: 'second' },
  { id: 1, name: 'first' },
];

const res = arr.filter(distinctBy(el => el.id));
// res -> [
//  { id: 1, name: 'first' },
//  { id: 2, name: 'second' },
// ]
```

### <a name="distinctWith"></a> distinctWith
Creates a predicate function for Array `.filter()` to:
Create a duplicate-free version of an array, using comparer function
for equality comparisons, in which only the first occurrence of each element is kept.

```js
import { distinctWith } from './filter';

const arr = [
  { id: 1, name: 'first' },
  { id: 2, name: 'second' },
  { id: 1, name: 'first' },
];

const res = arr.filter(distinctWith((a, b) => a.name === b.name));
// res -> [
//  { id: 1, name: 'first' },
//  { id: 2, name: 'second' },
// ]
```

### <a name="takeWhile"></a> takeWhile
Creates a predicate function for Array `.filter()` to:
Return elements from an array as long as a specified condition is true.

```js
import { takeWhile } from './filter';

const arr = [1, 2, 3, 1, 2];

const res = arr.filter(takeWhile(el => el < 3));
// res -> [1, 2, 3]
```

### <a name="skipWhile"></a> skipWhile
Creates a predicate function for Array `.filter()` to:
Bypass elements in a sequence as long as a specified condition is true
and then return the remaining elements.

```js
import { skipWhile } from './filter';

const arr = [1, 2, 3, 1, 2];

const res = arr.filter(skipWhile(el => el < 3));
// res -> [3, 1, 2]
```

## Array.prototype.reduce

### <a name="flatten"></a> flatten
Creates a reducer function for Array `.reduce()` that:
Flattens array a single level deep.

```js
import { flatten } from './reduce';

const arr = [
  [1, 2, 3],
  [4, 5],
  [6]
];

const res = arr.reduce(flatten(), []);
// res -> [1, 2, 3, 4, 5, 6]
```

### <a name="groupBy"></a> groupBy
Creates a reducer function for Array `.reduce()` that:
Groups the elements of an array according to a specified key selector function.
The elements of each group are projected by using a specified value selector function.

```js
import { groupBy } from './reduce';

const arr = [
  { key: 1, value: 'first' },
  { key: 2, value: 'second' },
  { key: 3, value: 'first' },
];

const groups = arr.reduce(groupBy(el => el.value), []);
// groups -> [
//   [{ key: 1, value: 'first' }, { key: 3, value: 'first' }],
//   [{ key: 2, value: 'second' }],
// ]
// groups[0].key -> 'first'
// groups[1].key -> 'second'
```

### <a name="toLookup"></a> toLookup
Creates a reducer function for Array `.reduce()` that:
Creates an object composed of keys generated from the results of running
each element of array thru key selector function.
The order of grouped values is determined by the order they occur in collection.
The corresponding value of each key is an array of elements responsible for generating the key.
The elements of each group are projected by using a specified value selector function.

```js
import { toLookup } from './reduce';

const arr = [
  { key: 1, value: 'first' },
  { key: 2, value: 'second' },
  { key: 3, value: 'first' },
];

const lookup = arr.reduce(toLookup(el => el.value), {});
// lookup -> {
//   'first': [{ key: 1, value: 'first' }, { key: 3, value: 'first' }],
//   'second': [{ key: 2, value: 'second' }],
// }
```

### <a name="toDictionary"></a> toDictionary
Creates a reducer function for Array `.reduce()` that:
Creates an object composed of keys generated from the results of running 
each element of collection thru key selector function.
The corresponding value of each key is the last element responsible for generating the key.
The values of an object are projected by using a specified value selector function.

```js
import { toDictionary } from './reduce';

const arr = [
  { key: 1, value: 'first' },
  { key: 2, value: 'second' },
];

const dict = arr.reduce(toDictionary(el => el.value), {});
// dict -> {
//   'first': { key: 1, value: 'first' },
//   'second': { key: 2, value: 'second' },
// }
```

### <a name="maxBy"></a> maxBy
Creates a reducer function for Array `.reduce()` that:
Finds element of the array that having max value of specified selector function.

```js
import { maxBy } from './reduce';

const arr = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 30 },
];

const preson = arr.reduce(maxBy(el => el.age), null);
// preson -> { name: 'Bob', age: 30 }
```

### <a name="minBy"></a> minBy
Creates a reducer function for Array `.reduce()` that:
Finds element of the array that having min value of specified selector function.

```js
import { minBy } from './reduce';

const arr = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 30 },
];

const preson = arr.reduce(minBy(el => el.age), null);
// preson -> { name: 'Alice', age: 20 }
```

## Array.prototype.sort

### <a name="asc"></a> asc
Creates a comparsion function for Array `.sort()` that:
Compares values returned by selector function in ascending order.

```js
import { asc } from './sort';

const arr = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 30 },
  { name: 'John', age: 25 },
];

arr.sort(asc(el => el.age));
// arr -> [
//   { name: 'Alice', age: 20 },
//   { name: 'John', age: 25 },
//   { name: 'Bob', age: 30 },
// ];
```

### <a name="desc"></a> desc
Creates a comparsion function for Array `.sort()` that:
Compares values returned by selector function in descending order.

```js
import { desc } from './sort';

const arr = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 30 },
  { name: 'John', age: 25 },
];

arr.sort(desc(el => el.age));
// arr -> [
//   { name: 'Bob', age: 30 },
//   { name: 'John', age: 25 },
//   { name: 'Alice', age: 20 },
// ];
```

### <a name="by"></a> by
Creates a comparsion function for Array `.sort()` that:
Combines multiple other comparsion functions.

```js
import { by, asc, desc } from './sort';

const arr = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 30 },
  { name: 'John', age: 20 },
];

arr.sort(by(
  asc(el => el.age),
  desc(el => el.name)
));
// arr -> [
//   { name: 'John', age: 20 },
//   { name: 'Alice', age: 20 },
//   { name: 'Bob', age: 30 },
// ];
```

## <a name="update"></a> Update Array
Updates the array of some class instances from an array
of some plain objects with matching keys.

```js
import { update } from './update';

interface Model {
  id: number;
  text: string;
}

class Entity {
  id: number;
  text: string;
}

let entities: Entity[];
let models: Model[];

update(entities)
  .from(models)
  .withKeys(e => e.id, m => m.id)
  .mapValues((e = new Entity(), m) => {
    e.id = m.id;
    e.text = m.text;
    return e;
  });
```
