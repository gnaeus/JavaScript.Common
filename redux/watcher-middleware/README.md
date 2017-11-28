__`store.js`__
```js
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import watcherMiddleware from "watcher-middleware";
import { myDataReducer, myDataWatcher } from "./myData";

const rootReducer = combineReducers({
  myData: myDataReducer,
});

const allWatchers = [
  myDataWatcher,
];

const store = createStore(
  rootReducer, initialState,
  applyMiddleware(
    thunkMiddleware,
    watcherMiddleware(allWatchers),
  ),
);
```
__`myData/index.js`__
```js
const MY_DATA_LOADED = "MY_DATA_LOADED";

// (state, action) => nextState
export function myDataReducer(state = null, action) {
  switch (action.type) {
    case MY_DATA_LOADED: {
      return action.payload;
    }

    default:
      return state;
  }
}

// (state, action) => nextAction
export function myDataWatcher(state, action) {
  switch (action.type) {
    case THIRD_PARTY_ACTION: {
      return loadMyData();
    }
  }
}

// action creators
function myDataLoaded(data) {
  return { type: MY_DATA_LOADED, payload: data };
}

function loadMyData() {
  return async dispatch => {
    const response = await fetch("/my-data");
    const data = await response.json();
    
    dispatch(myDataLoaded(data));
  }
}
```
