/**
 * Run `callback` when `selector` will be inserted to `container`.
 * If `callback` is not passed, returns Promise that
 * resolved when `selector` will be inserted to `container`.
 * @param {Element | string} container
 * @param {string} selector
 * @param {Function} [callback]
 * @returns {Promise | void}
 */
export function whenContains(container, selector, callback) {
  if (typeof container === "string") {
    container = document.querySelector(container);
  }
  if (typeof callback === "undefined") {
    if ("Promise" in window) {
      var promise = new Promise(function(resolve) {
        callback = resolve;
      });
    } else {
      throw new Error("Browser is not supported");
    }
  }

  if (container.querySelector(selector)) {
    callback();
  } else if ("MutationObserver" in window) {
    var observer = new MutationObserver(function() {
      if (container.querySelector(selector)) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(container, {
      childList: true,
      subtree: true
    });
  } else if ("MutationEvent" in window) {
    container.addEventListener("DOMSubtreeModified", function listener() {
      if (container.querySelector(selector)) {
        container.removeEventListener("DOMSubtreeModified", listener);
        callback();
      }
    });
  } else {
    throw new Error("Browser is not supported");
  }

  return promise;
}
