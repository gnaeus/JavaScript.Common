import { ReactNode } from "react";
import { Store, StoreEnhancer } from "redux";
import { Draft } from "immer";

/**
 * Redux Store enhancer
 * @example
 * import { createStore } from "redux";
 * import { composeWithDevTools } from "redux-devtools-extension";
 * import { immerEnhancer } from "redux-immer-hooks";
 * 
 * const reducer = state => state;
 * const initialState = { foo: "bar" };
 * 
 * function makeStore(state = initialState) {
 *   return createStore(reducer, state, composeWithDevTools(immerEnhancer));
 * }
 */
export declare const immerEnhancer: StoreEnhancer;

declare type ImmerUpdate<S> = Partial<S> | ((draft: Draft<S>) => void | S);

/**
 * Component-level hook that allows `immer` mutations of state.
 * Drop-in replacement for `React.useState()`.
 * @example
 * import { useImmer } from "redux-immer-hooks";
 * 
 * const [state, setState] = useImmer({ foo: 123, bar: 456 });
 * 
 * function incrementFoo() {
 *   const nextState = setState(state => {
 *     state.foo++;
 *   });
 * }
 * 
 * function setBar() {
 *   const nextState = setState({ bar: 789 });
 * }
 */
export declare function useImmer<S = any>(
  initialState: S | (() => S)
): [S, (updater: ImmerUpdate<S>) => S];

/**
 * Wrapper for Next.js App component.
 * Should be used before https://www.npmjs.com/package/next-redux-wrapper
 * @example
 * import App from "next/app";
 * import withRedux from "next-redux-wrapper";
 * import { withImmerHooks } from "redux-immer-hooks";
 * 
 * class MyApp extends App {
 *   // ...
 * }
 * 
 * function makeStore() {
 *   // ...
 * }
 * 
 * export default withRedux(makeStore)(withImmerHooks(MyApp));
 */
export declare function withImmerHooks<T extends ReactNode>(App: T): T;

export declare type ImmerDispatch<S> = <T>(
  type: string,
  updater: T extends Promise<any> ? never : (state: S) => T
) => T;

export declare type ImmerStore<S = any> = {
  dispatch: ImmerDispatch<S>;
} & Store<S, any>;

declare module "react-redux" {
  function useDispatch<S = any>(): ImmerDispatch<S>;
  function useStore<S = any>(): ImmerStore<S>;
}
