```js
var object = parseJsonDates({
  foo: "bar",
  number: 1,
  date: "2017-01-01T18:00:00.000Z",
  array: [1, "test", "2017-02-28T00:00:00.000Z"],
});

object == {
  foo: "bar",
  number: 1,
  date: new Date("2017-01-01T18:00:00.000Z"),
  array: [1, "test", new Date("2017-02-28T00:00:00.000Z")],
};
```
