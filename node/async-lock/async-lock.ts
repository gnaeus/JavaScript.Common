interface Deferred<T> {
  resolve: (res: T) => void;
  reject: (err: Error) => void;
  promise: Promise<T>;
}

class AsyncLock {
  queue: Function[] = null;
  maxPending: number;
  timeout: number;

  constructor({ maxPending = 1000, timeout = 0 } = {}) {
    this.timeout = timeout;
    this.maxPending = maxPending;
  }

  acquire<T>(func: () => Promise<T>): Promise<T>;
  acquire<T>(opts: { timeout: number }, func: () => Promise<T>): Promise<T>;
  acquire<T>(opts: any, func?: () => Promise<T>) {
    if (!func) {
      func = opts;
      opts = {};
    }
    const timeout = opts.timeout || this.timeout;

    let resolved = false;
    let timer = null;

    const deferred = {} as Deferred<any>;
    deferred.promise = new Promise((resolve, reject) => {
      deferred.reject = reject;
      deferred.resolve = resolve;
    });

    const done = (locked: boolean, err?: Error, res?: T) => {
      if (locked && this.queue.length === 0) {
        this.queue = null;
      }
      if (!resolved) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(res);
        }
        resolved = true;
      }
      if (locked) {
        // run next func
        if (this.queue && this.queue.length > 0) {
          this.queue.shift()();
        }
      }
    };

    const exec = async (locked: boolean) => {
      if (resolved) {
        // may due to timed out
        done(locked);
      } else {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        try {
          done(locked, undefined, await func());
        } catch (err) {
          done(locked, err);
        }
      }
    };

    if (!this.queue) {
      this.queue = [];
      exec(true);
    } else if (this.queue.length >= this.maxPending) {
      done(false, new Error("Too much pending tasks"));
    } else {
      this.queue.push(() => {
        exec(true);
      });
      if (timeout) {
        timer = setTimeout(() => {
          timer = null;
          done(false, new Error("async-lock timed out"));
        }, timeout);
      }
    }

    return deferred.promise;
  }
}

export default AsyncLock;
