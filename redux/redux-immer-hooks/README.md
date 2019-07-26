# Redux Immer Hooks

Use Redux as immutable database with mutable updates by dispatching named
mutations instead of actions. And separate logic with custom React hooks.

**`store.dispatch(name: String, action: Function);`**

Directly mutate store state with passed function. Immutable updates are provided by [immer](https://github.com/immerjs/immer). Action name is only for Redux Dev Tools.

### Pros

- Hooks are composable. So we can use one custom hook from another.
- Hooks provides code splitting out of the box (unlike reducers).
- Dispatched mutations are composable. So we can call some mutations inside
  another mutations. And it results to single batch update of the Store.
- We don't need to write action types, action creators and reducers. So
  tightly coupled logic is not spread over many source files.
- We still use unidirectional data flow.
- We still use plain old JavaScript objects. So our state is serializable.
- We still use immutable data and all `react-redux` stack based on it.

### Cons

- It can seems weird :-)
- Actions are no longer serializable.
- Middlewares can not call our two-argument dispatch function.

### Usage

```js
import { useStore } from "react-redux";

const initialState = {
  posts: {},
  comments: {},
};

function usePostService(postId) {
  const { dispatch } = useStore();

  function publishPost() {
    dispatch("publishPost", state => {
      const post = state.posts[postId];
      post.publishDate = new Date();
    });
  }

  return { getPost, publishPost };
}

function useCommentService(postId) {
  const { dispatch } = useStore();

  function addComment(text) {
    dispatch("addComment", state => {
      const comment = { id: nextId(), text };
      state.comments[comment.id] = comment;

      const post = state.posts[postId];
      post.comments.push(comment.id);
    });
  }

  return { addComment };
}

function PostView({ postId }) {
  const { publishPost } = usePostService(postId);
  const { addComment } = useCommentService(postId);

  return (
    // ...
    <button onClick={publishPost}>Publish</button>
    <button onClick={addComment}>Comment</button>
  )
}
```

## Setup

**`function immerEnhancer(createStore);`**

Redux Store enhancer.

```js
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { immerEnhancer } from "redux-immer-hooks";

const reducer = state => state;

const initialState = { foo: "bar" };

function makeStore(state = initialState) {
  return createStore(reducer, state, composeWithDevTools(immerEnhancer));
}
```

### With Next.js

**`function withImmerHooks(App);`**

Wrapper for Next.js App component. Should be used before [next-redux-wrapper](https://www.npmjs.com/package/next-redux-wrapper).

```js
import App from "next/app";
import withRedux from "next-redux-wrapper";
import { withImmerHooks } from "redux-immer-hooks";

class MyApp extends App {
  // ...
}

function makeStore() {
  // ...
}

export default withRedux(makeStore)(withImmerHooks(MyApp));
```

## Local Component State

**`function useImmer(initialState);`**

Component-level hook that allows `immer` mutations of state.
Drop-in replacement for `React.useState()`.

```js
import { useImmer } from "redux-immer-hooks";

const [state, setState] = useImmer({ foo: 123, bar: 456 });

function incrementFoo() {
  const nextState = setState(state => {
    state.foo++;
  });
}

function setBar() {
  const nextState = setState({ bar: 789 });
}
```
