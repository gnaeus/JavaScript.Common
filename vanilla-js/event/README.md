## Simple event pattern in JavaScript

```js
import { event } from './event';

class MyWidget {
  onChange = event();

  change() {
    // do something
    this.onChange(this, this.value);
  }
}

class MyForm {
  widget = new MyWidget();

  constructor() {
    this.handleWidgetChange = this.handleWidgetChange.bind(this);

    this.widget.onChange.attach(this.handleWidgetChange);
  }

  dispose() {
    this.widget.onChange.detach(this.handleWidgetChange);
  }

  handleWidgetChange(sender, data) {
    // do something
  }
}
```

TypeScript Example:

```js
import { event, EventHandler } from './event';

class MyWidget {
  data = '';
  onChange = event<(sender: this, data: string) => void>();
  onInput = event() as EventHandler<string>;

  change() {
    // do something
    this.onChange(this, this.data);
  }

  input() {
    this.onInput(this, this.data);
  }
}
```
