__`function downloadFile(url: string, onError: Function): void`__  
Download file without explicitely clicking on link.

__`function fetchJson(url: string, data?: Object, method?: HttpVerb): Promise<void>`__  
__`function fetchJson<TResponse>(url: string, data?: Object, method?: HttpVerb): Promise<TResponse>`__  
Fetch JSON from specified URL or throw `FetchError`.

__`function fetchFormData(url: string, formData: FormData): Promise<void>`__  
__`function fetchFormData<TResponse>(url: string, formData: FormData): Promise<TResponse>`__  
Post `FormData` to specified URL then read JSON or throw `FetchError`.

```js
interface FetchError extends Error {
    statusCode: number;
    statusText: string;
    response: Response;
}
```

__`function formatPhoneNumber(number: string): string`__  
Pretty print phone number.

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

__`function whenContains(container: Element | string, selector: string): Promise<void>`__
Run `callback` when `selector` will be inserted to `container`.

__`function whenContains(container: Element | string, selector: string, callback: () => void): void`__
Returns Promise that resolved when `selector` will be inserted to `container`.

__`function zIndexMaxInContext(node: Element): number`__  
Максимальное значение `z-index` внутри контекста наложения, к которому принадлежит `node`.  
Значения `z-index` в других контекстах наложения игнорируются.

__`function setEquals(first: any[], second: any[]): boolean`__
Check if two arrays contains the same set of elements.