import { createElement, createContext, useContext, useRef } from "react";

interface Injector extends Map<Function, any> {
  _parent?: Injector;
}

function getInstance(
  injector: Injector | undefined,
  isClass: boolean,
  factory: any,
  args: unknown[] | undefined
) {
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

const InjectorContext = createContext<Injector | undefined>(undefined);

let currentInjector: Injector | undefined;

function useInstance<T>(
  isClass: boolean,
  factory: unknown,
  args: unknown[] | undefined
) {
  if (currentInjector) {
    return getInstance(currentInjector, isClass, factory, args);
  }
  const instanceRef = useRef<T | undefined>(undefined);
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
  return instanceRef.current!;
}

/**
 * React Hook that injects factory value to React component props
 * or to factory arguments or to class constructor.
 * @param constructor Factory for injected value
 * @param args Optional args that can override injected defaults
 */
function useFactory<T, A extends unknown[]>(
  factory: (...args: A) => T,
  args?: A
): T {
  return useInstance(false, factory, args);
}

/**
 * React Hook that injects class instance to React component props
 * or to factory arguments or to class constructor.
 * @param constructor Constructor of injected class
 * @param args Optional args that can override injected defaults
 */
function useService<T, A extends unknown[]>(
  constructor: new (...args: A) => T,
  args?: A
): T {
  return useInstance(true, constructor, args);
}

/**
 * HOC that bind lifetime of specified services to wrapped React component
 * @param factories Factories or constructors for services
 */
function withProvider(...factories: Function[]): <T>(component: T) => T;
/**
 * HOC that bind lifetime of specified services to wrapped React component
 * @param factories Factories or constructors for services
 */
function withProvider(...factories: Function[]) {
  return (Component: any) => (props: object) => {
    const injectorRef = useRef<Injector | undefined>(undefined);
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
