### Attach memoized entity selectors to normalized entity structure

Example State structure:

```js
{
  entities: {
    authors: {
      123: {
        id: 123,
        posts: [4567]
      }
    },
    posts: {
      4567: {
        id: 4567,
        isArchived: false,
        author: 123
      }
    }
  }
}
```

Example Reducers:

```js
import { entitySelector } from "linked-entity-selector";

// authorReducer.js
const initialState = {
  posts: [],
  getPosts: entitySelector("posts", state => state.entities.posts, (posts, id) => posts[id]);
};

function authorReducer(state = initialState, action) {
  switch (action.type) {
    case REMOVE_POSTS:
      return {
        ...state,
        posts: state.posts.filter(id => acton.postIds.includes(id))
      }
    default:
      return state;
  }
}

// postReducer.js
const initialState = {
  isArchived: false,
  author: null,
  getAuthor: entitySelector("author", (state, id) => state.entities.authors[id])
};

function postReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

// authorActions.js
function removeArchivedPosts(author) {
  return (dispatch, getState) => {
    const state = getState();
    const posts = author.getPosts(state).filter(post => post.isArchived);
    dispatch(removePosts(author, posts));
  }
}

function removePosts(author, posts) {
  return {
    type: REMOVE_POSTS,
    authorId: author.id,
    postIds: posts.map(post => post.id)
  }
}
```
