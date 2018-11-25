import { Component, createElement, createContext } from "react";

const ObserverContext = createContext(false);

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
  // @ts-ignore
  return class Observer extends Component {
    componentDidMount() {
      if (!this.context) {
        observers.add(this);
      }
    }

    componentWillUnmount() {
      if (!this.context) {
        observers.delete(this);
      }
    }

    render() {
      return createElement(
        ObserverContext.Provider,
        { value: true },
        // @ts-ignore
        createElement(component, this.props)
      );
    }
  };
}

/** @type {Set<Component>} */
const observers = new Set();

/**
 * Method decorator that triggers @observer rendering after decorated method execution.
 * @param {Object} _prototype Object or Class prototype
 * @param {string | symbol} _key Property key or method to wrap
 * @param {Object} descriptor Property descriptor
 * @example
 * class Servive {
 *   @action
 *   doSomething() {}
 * }
 */
export function action(_prototype, _key, descriptor) {
  const method = descriptor.value;
  descriptor.value = function() {
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
  };
}

let runningCount = 0;
