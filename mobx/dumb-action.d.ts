/**
 * React HOC that triggers @see forceUpdate() after each @action method execution
 * @param component Component to wrap
 * @returns Observer component
 * @example
 * @observer
 * class App extends Component {}
 */
export declare function observer<T extends Function>(component: T): T;

/**
 * Function wrapper that triggers @observer rendering after decorated method execution.
 * @example
 * class Servive {
 *   doSomething = action((...args) => {})
 * }
 */
export function action<T extends Function>(method: T): T;
/**
 * Method decorator that triggers @observer rendering after decorated method execution.
 * @example
 * class Servive {
 *   @action
 *   doSomething(...args) {}
 * }
 */
export function action<T>(
  prototype: Object,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T>;
