export const memoize = func => (...args) => {
  const key = JSON.stringify(args);
  return key in func ? func[key] : (func[key] = func(...args));
};
