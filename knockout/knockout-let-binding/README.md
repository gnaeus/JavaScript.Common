https://github.com/knockout/knockout/blob/master/src/binding/defaultBindings/let.js
```js
let vm = { firstName: "John", lastName: "Doe" };
```
```html
<div data-bind="let: { fullName: firstName + ' ' + lastName }">
  FirstName: <span data-bind="text: firstName"></span>
  LastName: <span data-bind="text: lastName"></span>
  FullName: <span data-bind="text: fullName"></span>
</div>
```