
## Execude only one async function while lock is acquired. Other functions are queued.

```js
import AsyncLock from "async-lock";

const lock = new AsyncLock();

setInterval(() => {
  lock.acquire(async () => {
    await delay(3000);
  });
}, 2000);
```

### Options

```js
const lock = new AsyncLock({ maxPending: 1000, timeout: 10000 });

lock.acquire({ timeout: 5000 }, async () => {
  await delay(3000);
});
```