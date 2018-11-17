
 * Deep merge `Object` fields.
 * Preserve `null`s not only in Enitty but also in nested Object.

```js
import { schema } from "normalizr"
import { ObjectSchema } from "./object-schema";
import { structuralMerge } from "./structural-merge";

// or import patch for schema.Object
import "./object-schema-fix";

// deep merge `Object` fields
const User = new schema.Entity("users", {}, { mergeStrategy: structuralMerge }});

// preserve `null`s not only in Enitty but also in nested Object
const UserDetails = new ObjectSchema({});

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

```
