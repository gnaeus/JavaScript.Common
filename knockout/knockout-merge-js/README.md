<h3> Update target object from source object with automatic ko.observable mapping </h3>
Use only with flat objects. For more complex structures please use ko.mapping plugin.
```js
class Model {
  first = ko.observable();
  @observable second;
  third;
}

let source = {
  first: "abc",
  second: 123,
  third: new Date(),
};

let target = new Model();

ko.mergeJS(source, target);
```