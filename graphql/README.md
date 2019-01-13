Create separate `DataLoader` for each field resolver by caching it in `info` argument.
```js
function dataLoader(
  info: Object, keyAttr?: string | Function, batchLoad: Function
): DataLoader;
```

```
query {
  posts(top: 10) {
    title
    author {
      name
    }
    comments(top: 3) {
      text
      rating
    }
  }
}
```
```js
import { groupBy } from "lodash/fp"
import graphqlFields from "graphql-fields";
import dataLoader from "./dataloader";

// Query resolver
export const Query = {
  // from MongoDB
  async posts(_, args, context) {
    return context.mongo.collection("posts").find().limit(args.top).toArray();
  }
}

// Post resolver
export const Post = {
  // from REST
  async author(post, args, context, info) {
    const userLoader = dataLoader(info, "id", ids =>
      fetch(`/users/ids=${ids.join(",")}`).then(r => r.json())
    );
    return await userLoader.load(post.authorId);
  },

  // from SQLite
  async comments(post, args, context, info) {
    const commentsLoader = dataLoader(info, async postIds => {
      const fields = Object.keys(graphqlFields(info));
      const rows = await context.sql(`
      SELECT postId, ${fields.join()}
      FROM comments AS c
      WHERE c.postId IN (${postIds.join()})
        AND c.id IN (
        SELECT c2.id
        FROM comments AS c2
        WHERE c2.postId = c.postId
        ORDER BY c2.rating DESC
        LIMIT ${args.top}
      )`);
      const commentsByPost = groupBy(rows, "postId");
      return postIds.map(postId => commentsByPost[postId] || []);
    });
    return await commentsLoader.load(post.id);
  }
}
```

## Options

Specify `keyAttribute` as function:
```js
import dataLoader from "./dataloader";
// Resolver for `Post`
const Post = {
  async author(post, args, context, info) {
    const userLoader = dataLoader(info, u => u.id, ids =>
      fetch(`/users/ids=${ids.join(",")}`).then(r => r.json())
    );
    return await userLoader.load(post.authorId);
  }
};
```

Explicitely define `BatchLoadFn`:
```js
import dataLoader from "./dataloader";
// Resolver for `Post`
const Post = {
  async author(post, args, context, info) {
    const userLoader = dataLoader(info, async ids => {
      const response = await fetch(`/users/ids=${ids.join(",")}`);
      const users = await response.json();
      return ids.map(id => users.find(u => u.id = id));
    });
    return await userLoader.load(post.authorId);
  }
};
```

Explicitely define `DataLoader`:
```js
import DataLoader from "dataloader";
import dataLoader from "./dataloader";
// Resolver for `Post`
const Post = {
  async author(post, args, context, info) {
    const userLoader = dataLoader(info, () => new DataLoader(
      async ids => {
        const response = await fetch(`/users/ids=${ids.join(",")}`);
        const users = await response.json();
        return ids.map(id => users.find(u => u.id = id));
      },
      { cache: false }
    ));
    return await userLoader.load(post.authorId);
  }
};
```
