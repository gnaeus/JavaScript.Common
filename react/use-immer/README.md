Component-level hook that allows `immer` mutations of immutable state.  
Drop-in replacement for `React.useState()`.

We can dispatch:
- function that modifies draft object,
- or function that returns new state object,
- or even object which props are merged into current state.

Also, `dispatch` function returns changed state object.  
And we can use `dispatch()` without arguments to get current state.

```js
const [state, dispatch] = useImmer({ foo: 123, bar: 456 });

function changeFoo() {
  const nextState = dispatch(draft => {
    draft.foo++;
  });
}

function changeBar() {
  const currentState = dispatch();
  const nextState = dispatch({ bar: currentState.bar + 1 });
}
```