interface Object {
  z<X, Y>(func: (x: X) => Y): ReturnType<typeof func>;
}

Object.defineProperty(Object.prototype, "z", {
  value: function(func) {
    return func(this.valueOf());
  },
  writable: true,
  configurable: true
});
