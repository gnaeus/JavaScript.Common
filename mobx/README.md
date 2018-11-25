## weak-cache
Attach hidden `@computed` to model object through `WeakMap`.

```js
import { observable } from "mobx";
import { ComputedCache } from "./weak-cache";

class Model {
  @observable length: string; 
}

const areaCache = new ComputedCache<Model, string>();

class View {
  // attach hidden @computed to model through WeakMap
  getArea(model: Model) {
    return areaCache.getOrAdd(model, { keepAlive: true }, () => {
      return model.length * model.length;
    });
  }
}

```

## dumb-action
Very dumb drop-in replacement for `mobx` and `mobx-react`.  
Only two decorators: `@observer` and `@action`.  
An `@action` calls `forceUpdate()` only on topmost `@observer`.

```jsx
import React, { Component } from "react";
import { observer, action } from "./dumb-action";

@observer
class App extends Component {
  render() {
    // ...
  }
}

// or
const App = () => <div>{/* ... */}</div>;
export default observer(App);

class Page extends Component {
  @action
  doSomething() {
    // ...
  } // .forceUpdate() on <App />

  render() {
    // ...
  }
}

// or
class Service {
  @action
  doSomething() {
    // ...
  } // .forceUpdate() on <App />
}
```
