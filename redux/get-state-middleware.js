/**
 * Redux Middleware for getting root state in nested reducers
 */
export const getStateMiddleware = store => next => action => {
  next({ ...action, getState: store.getState });
};
