/** 
 * Factory that creates event function.
 * Which delegates it's execution to list of handlers.
 */
export function event() {
  const listeners = [];

  const e = function (...args) {
    listeners.slice().forEach(handler => {
      handler(...args);
    });
  }

  e.attach = handler => {
    listeners.push(handler);
  };

  e.detach = handler => {
    listeners.splice(listeners.indexOf(handler) >>> 0, 1);
  };

  return e;
}
