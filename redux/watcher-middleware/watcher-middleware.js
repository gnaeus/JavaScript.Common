export default function (watchers) {
  return ({ dispatch, getState }) => next => action => {
    const result = next(action);
    const state = getState();
    watchers.forEach(watcher => {
      const nextAction = watcher(state, action);
      if (nextAction) {
        dispatch(nextAction);
      }
    });
    return result;
  };
}
