/**
 * React Hook that injects factory value to React component props
 * or to factory arguments or to class constructor.
 * @param constructor Factory for injected value
 * @param args Optional args that can override injected defaults
 */
declare function useFactory<T, A extends unknown[]>(factory: (...args: A) => T, args?: A): T;
/**
 * React Hook that injects class instance to React component props
 * or to factory arguments or to class constructor.
 * @param constructor Constructor of injected class
 * @param args Optional args that can override injected defaults
 */
declare function useService<T, A extends unknown[]>(constructor: new (...args: A) => T, args?: A): T;
/**
 * HOC that bind lifetime of specified services to wrapped React component
 * @param factories Factories or constructors for services
 */
declare function withProvider(...factories: Function[]): <T>(component: T) => T;
export { useFactory, useService, withProvider };
