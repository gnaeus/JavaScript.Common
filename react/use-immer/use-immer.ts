import { useState, useRef, useCallback } from "react";
import produce, { Draft } from "immer";

/**
 * Component-level hook that allows `immer` mutations of immutable state.
 * Drop-in replacement for `React.useState()`.
 * @example
 * const [state, dispatch] = useImmer({ foo: 123, bar: 456 });
 *
 * function changeFoo() {
 *   const nextState = dispatch(draft => {
 *     draft.foo++;
 *   });
 * }
 *
 * function changeBar() {
 *   const currentState = dispatch();
 *   const nextState = dispatch({ bar: currentState.bar + 1 });
 * }
 */
export function useImmer<S = any>(
  initialState: S | (() => S)
): [S, (updater?: Partial<S> | ((draft: Draft<S>) => void | S)) => S] {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  return [
    state,
    useCallback(updater => {
      if (updater) {
        if (typeof updater === "function") {
          stateRef.current = produce(stateRef.current, updater) as S;
        } else if (typeof updater === "object") {
          stateRef.current = { ...stateRef.current, ...updater };
        } else {
          throw new Error("State Updater must be function or object");
        }
        setState(stateRef.current);
      }
      return stateRef.current;
    }, [])
  ];
}

export default useImmer;
