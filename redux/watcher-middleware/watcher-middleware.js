export default function(watchers) {
  return ({ dispatch, getState }) => next => action => {
    const result = next(action);
    const state = getState();

    const length = watchers.length;
    for (let i = 0; i < length; i++) {
      const nextAction = watchers[i](state, action);

      if (nextAction) {
        dispatch(nextAction);
      }
    }

    return result;
  };
}
