<h3> subscription.pause(), subscription.resume() </h3>
https://github.com/knockout/knockout/issues/1391
```js
let observable = ko.observable();
let subscription = observable.subscribe((val) => {
  console.log(val);
});

observable(123); // console: 123
subscription.pause();
observable(456); // nothing happened
subscription.resume();
observable(789)  // console: 789
```