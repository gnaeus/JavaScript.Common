import { createElement, createContext, useContext, useRef } from "react";

function getInstance(injector, isClass, factory, args) {
  while (injector) {
    let instance = injector.get(factory);
    if (instance !== undefined) {
      return instance;
    }
    if (injector.has(factory)) {
      const prevInjector = currentInjector;
      currentInjector = injector;
      try {
        if (isClass) {
          instance = args ? new factory(...args) : new factory();
        } else {
          instance = args ? factory(...args) : factory();
        }
      } finally {
        currentInjector = prevInjector;
      }
      injector.set(factory, instance);
      return instance;
    }
    injector = injector._parent;
  }
  throw new Error(`Dependency ${factory.name} is not registered in provider`);
}

const InjectorContext = createContext(undefined);

let currentInjector;

function useInstance(isClass, factory, args) {
  if (currentInjector) {
    return getInstance(currentInjector, isClass, factory, args);
  }
  const instanceRef = useRef(undefined);
  currentInjector = useContext(InjectorContext);
  try {
    if (!instanceRef.current) {
      instanceRef.current = getInstance(
        currentInjector,
        isClass,
        factory,
        args
      );
    }
  } finally {
    currentInjector = undefined;
  }
  return instanceRef.current;
}

/**
 * React Hook that injects factory value to React component props
 * or to factory arguments or to class constructor.
 * @param constructor Factory for injected value
 * @param args Optional args that can override injected defaults
 */
function useFactory(factory, args) {
  return useInstance(false, factory, args);
}

/**
 * React Hook that injects class instance to React component props
 * or to factory arguments or to class constructor.
 * @param constructor Constructor of injected class
 * @param args Optional args that can override injected defaults
 */
function useService(constructor, args) {
  return useInstance(true, constructor, args);
}

/**
 * HOC that bind lifetime of specified services to wrapped React component
 * @param factories Factories or constructors for services
 */
function withProvider(...factories) {
  return Component => props => {
    const injectorRef = useRef(undefined);
    let injector = injectorRef.current;
    if (!injector) {
      injector = injectorRef.current = new Map();
      for (const factory of factories) {
        injector.set(factory, undefined);
      }
    }
    injector._parent = useContext(InjectorContext);
    return createElement(
      InjectorContext.Provider,
      { value: injector },
      createElement(Component, props)
    );
  };
}

export { useFactory, useService, withProvider };
