import { Component, createElement, createContext } from "react";

const ObserverContext = createContext(true);

/**
 * React HOC that triggers @see forceUpdate() after each @action method execution
 * @template {Function} T
 * @param {T} component Component to wrap
 * @returns {T} Observer component
 * @example
 * @observer
 * class App extends Component {}
 */
export function observer(component) {
  class Observer extends Component {
    componentDidMount() {
      if (this.context) {
        observers.add(this);
      }
    }

    componentWillUnmount() {
      if (this.context) {
        observers.delete(this);
      }
    }

    render() {
      return createElement(
        ObserverContext.Provider,
        { value: false },
        // @ts-ignore
        createElement(component, this.props)
      );
    }
  }
  Observer.contextType = ObserverContext;
  // @ts-ignore
  return Observer;
}

/** @type {Set<Component>} */
const observers = new Set();

/**
 * Function wrapper or method decorator that triggers @observer rendering after decorated method execution.
 * @param {Function | Object} method Wrapped method or Class prototype
 * @param {string | symbol} [key] Property key or method to wrap
 * @param {Object} [descriptor] Property descriptor
 * @returns {*} Wrapper function or descriptor
 * @example
 * class Servive {
 *   @action
 *   doSomething() {}
 * }
 */
export function action(method, key, descriptor) {
  function wrapper() {
    let result;
    runningCount++;
    try {
      result = method.apply(this, arguments);
    } finally {
      runningCount--;
    }
    if (runningCount === 0) {
      observers.forEach(observer => {
        observer.forceUpdate();
      });
    }
    return result;
  }

  if (key) {
    method = descriptor.value;
    descriptor.value = wrapper;
    return descriptor;
  }
  return wrapper;
}

let runningCount = 0;
