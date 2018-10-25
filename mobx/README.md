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