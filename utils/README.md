__`function hash(str: string): number`__  
32-bit hash of string. If string contains number it returns this number.

__`function parseJsonDates(data: any): any`__  
Resursively replace all strings like "yyyy-MM-ddThh:mm:ss.xxxZ" to Date objects.

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

__`function zIndexMaxInContext(node: Element): number`__  
Максимальное значение `z-index` внутри контекста наложения, к которому принадлежит `node`.  
Значения `z-index` в других контекстах наложения игнорируются.
