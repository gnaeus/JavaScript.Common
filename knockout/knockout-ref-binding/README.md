<h3> Knockout binding inspired by React `ref` JSX-attribute </h3>
```js
class ViewModel {
  MyDiv: HTMLElement = null;
}
```
```html
<div data-bind="ref: MyDiv"></div>
<div data-bind="ref: function(el) { MyDiv = el; }"></div>
```