import { useState, useRef, useCallback, createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import produce, { createDraft, finishDraft } from "immer";

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
export const immerEnhancer = createStore => (reducer, preloadedState) => {
  const immerReducer = (state, { payload, meta }) =>
    meta === "IMMER" ? payload : reducer(state);

  const store = createStore(immerReducer, preloadedState);

  let draft = null;
  let pendingCount = 0;

  const dispatch = (type, action) => {
    if (typeof type === "string" && typeof action === "function") {
      let result;
      if (pendingCount === 0) {
        draft = createDraft(store.getState());
      }
      pendingCount++;
      try {
        result = action(draft);
      } finally {
        pendingCount--;
      }
      if (result instanceof Promise) {
        throw new Error("Immer Action must be synchronous");
      }
      if (pendingCount === 0) {
        const nextState = finishDraft(draft);
        draft = null;
        store.dispatch({ type, payload: nextState, meta: "IMMER" });
      }
      return result;
    }
    return store.dispatch(action);
  };
  return { ...store, dispatch };
};

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
export function useImmer(initialState) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  function dispatch(updater) {
    if (typeof updater === "function") {
      stateRef.current = produce(stateRef.current, updater);
    } else if (updater && typeof updater === "object") {
      stateRef.current = { ...stateRef.current, ...updater };
    } else {
      throw new Error("State Updater must be function or object");
    }
    setState(stateRef.current);
    return stateRef.current;
  }
  return [state, useCallback(dispatch, [])];
}

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
export function withImmerHooks(App) {
  const {
    getInitialProps = async ({ Component: { getInitialProps }, ctx }) => ({
      pageProps: getInitialProps ? await getInitialProps(ctx) : {}
    })
  } = App;

  App.getInitialProps = async props => {
    let promise, div;

    function Consumer() {
      promise = getInitialProps(props);
      if (div) {
        unmountComponentAtNode(div);
      }
      return null;
    }

    const node = createElement(
      Provider,
      { store: props.ctx.store },
      createElement(Consumer)
    );

    if (typeof window === "undefined") {
      renderToStaticMarkup(node);
    } else {
      div = document.createElement("div");
      render(node, div);
    }

    return Promise.resolve(promise);
  };

  return App;
}
