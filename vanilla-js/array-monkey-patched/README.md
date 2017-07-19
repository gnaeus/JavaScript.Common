#### Monkey patching `Array.prototype` with `groupBy()`, `orderBy()`, `toDictionary()` and `toLookup()` methods
```js
var groups = [5, 5, "5"].groupBy(el => el);
// groups -> [
//   [5, 5],
//   ["5"]
// ]
// groups[0].key -> 5
// groups[1].key -> "5"

var array = [1, 4, 3, 5, 2].orderBy(el => el);
// array -> [1, 2, 3, 4, 5];

var dict = [1, 2, 3].toDictionary(el => el);
// dict -> {
//   "1": 1,
//   "2": 2,
//   "3": 3,
//  }

var lookup = [2, 2, 5, 5, "2", "5"].toLookup(el => el);
// lookup -> {
//   "2": [2, 2, "2"],
//   "5": [5, 5, "5"],
// }
```
