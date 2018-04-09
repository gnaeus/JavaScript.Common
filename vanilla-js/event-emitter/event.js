/** Generic async EventEmitter (requires ES6 Map and Promise) */
export class Event {
  constructor() {
    this._handlers = [];
    this._handlersMap = new Map();
  }

  /**
   * Call event handlers with specified arguments
   * @param {any[]} args Event handler arguments
   */
  emit(...args) {
    const [name, ...restArgs] = args;
    const handlers = this._handlers.slice();
    const namedHandlers = (this._handlersMap.get(name) || []).slice();

    const promises = handlers
      .map(handler => handler(...args))
      .concat(namedHandlers.map(handler => handler(...restArgs)))
      .filter(
        promise =>
          typeof promise === "object" &&
          promise !== null &&
          typeof promise.then === "function"
      );

    return Promise.all(promises);
  }

  /**
   * Attach handler to event
   * @param {any} nameOrHandler Event name or event handler function
   * @param {Function} [handler] Event handler function
   * @returns {{ dispose(): void }}
   */
  subscribe(nameOrHandler, handler) {
    if (handler) {
      let handlers = this._handlersMap.get(nameOrHandler);
      if (!handlers) {
        handlers = [];
        this._handlersMap.set(nameOrHandler, handlers);
      }
      handlers.push(handler);
      const dispose = () => {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        if (handlers.length === 0) {
          this._handlersMap.delete(nameOrHandler);
        }
      };
      return { dispose };
    } else {
      this._handlers.push(nameOrHandler);
      const dispose = () => {
        this._handlers.splice(this._handlers.indexOf(nameOrHandler) >>> 0, 1);
      };
      return { dispose };
    }
  }

  /**
   * Detach handler from event
   * @param {any} nameOrHandler Event name or event handler function
   * @param {Function} [handler] Event handler function
   */
  unsubscribe(nameOrHandler, handler) {
    if (handler) {
      const handlers = this._handlersMap.get(nameOrHandler);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        if (handlers.length === 0) {
          this._handlersMap.delete(nameOrHandler);
        }
      }
    } else {
      this._handlers.splice(this._handlers.indexOf(nameOrHandler) >>> 0, 1);
    }
  }
}
