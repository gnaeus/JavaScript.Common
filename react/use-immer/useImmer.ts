import produce, { Draft } from "immer";
import { useState, useCallback, useRef, MutableRefObject } from "react";

let pendingCount = 0;

const mutations = new Map<MutableRefObject<any>, (value: any) => void>();

type Updater<S> = Partial<S> | ((draft: Draft<S>) => void | S);

function useImmer<S = any>(
  initialState: S | (() => S)
): [S, (updater: Updater<S>) => S, () => S] {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);

  function dispatch(updater: Updater<S>) {
    if (typeof updater === "function") {
      stateRef.current = produce(stateRef.current, updater) as S;
    } else if (updater && typeof updater === "object") {
      stateRef.current = {
        ...stateRef.current,
        ...updater
      };
    }
    if (pendingCount === 0) {
      setState(stateRef.current);
    } else {
      mutations.set(stateRef, setState);
    }
    return stateRef.current;
  }

  return [
    state,
    useCallback(dispatch, []),
    useCallback(() => stateRef.current, [])
  ];
}

export function transaction(action: () => void) {
  pendingCount++;
  try {
    action();
  } finally {
    pendingCount--;
  }
  if (pendingCount === 0) {
    mutations.forEach((setState, stateRef) => {
      setState(stateRef.current);
    });
  }
}

export default useImmer;
