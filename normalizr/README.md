
 * Preserve `null`s not only in Enitty but also in nested Object.
   https://github.com/paularmstrong/normalizr/issues/332
 * Deep merge `Object` fields.
 * Denormalize entire `entities` object.

```js
import { normalize, schema } from "normalizr"
// fix schema.Object
// https://github.com/paularmstrong/normalizr/issues/332
import "./object-schema";
import { structuralMerge } from "./structural-merge";
import { denormalizeEntities } from "./denormalize-entities";

// deep merge `Object` fields
const User = new schema.Entity("users", {}, { mergeStrategy: structuralMerge }});

// preserve `null`s not only in Enitty but also in nested Object
const UserDetails = new schema.Object({});

User.define({
  details: UserDetails
});

UserDetails.define({
  bestFriend: User,
  followers: [User],
  following: [User]
});

const users = [
  {
    id: 123,
    details: {
      bestFriend: null
      followers: [{ id: 234, id: 345 }]
    }
  },
  {
    id: 123,
    details: {
      following: [{ id: 456, id: 567 }]
    }
  },
];

const { entities } = normalize(users, [User]);

// results to 

const entities = {
  users: {
    123: {
      id: 123,
      details: {               // Object fields are deeply merged
        bestFriend: null       // `null` field is preserved
        followers: [234, 345],
        following: [465, 567]
      }
    },
    // ...
  }
}

// Denormalize entire `entities` object.
const objects = denormalizeEntities(entities, [User, /* Comment, Post, etc. */]);
```
