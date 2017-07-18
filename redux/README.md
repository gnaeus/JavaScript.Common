### Speedup Redux normalized state 'byId' object transformation

Example State structure:
```js
users: {
  byId: {
    "user1": {
      id: "user1",
      name: "John",
    },
    "user2": { ... },
   ...
  },
  allIds: [ "user1", "user2", ... ],
}
```

Default Reducer:
```js
function usersReducer(state, action) {
  switch (action.type) {
    case CHANGE_NAME:
      const { id, name } = action.payload;
      return {
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            name: name,
          }
        }
        allIds: state.allIds,
      };
    default:
      return state;
  }
}
```

Reducer with `protoMerge()`:
```js
function usersReducer(state, action) {
  switch (action.type) {
    case CHANGE_NAME:
      const { id, name } = action.payload;
      return {
        byId: protoMerge(state.byId, {
          [id]: {
            ...state.byId[id],
            name: name,
          }
        }),
        allIds: state.allIds,
      };
    default:
      return state;
  }
}
```
