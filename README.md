## Upload Avatar w/ Instant Storage

This is a simple example of how to upload an avatar image to a user's profile
using [InstantDB](https://instantdb.com)

<img width="392" alt="Image" src="https://github.com/user-attachments/assets/2de39da7-cbe9-49b2-8118-2454939a5fb2" />

### Quick Start

Clone the repo and install the dependencies

```shell
git clone ...
cd instant-storage-avatar-example
npm install
```

Initialize your schema and permissions via the Instant CLI

```
npx instant-cli@latest init
```

Now open `instant.shema.ts` and replace the contents with the following code.

```javascript
import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      createdAt: i.date().indexed(),
      nickname: i.string().unique().indexed(),
    }),
  },
  links: {
    profiles$user: {
      forward: {
        on: 'profiles',
        has: 'one',
        label: '$user',
      },
      reverse: {
        on: '$users',
        has: 'one',
        label: 'profile',
      },
    },
    profilesAvatar: {
      forward: {
        on: 'profiles',
        has: 'one',
        label: 'avatar',
      },
      // Notice that $files is on the reverse side
      reverse: {
        on: '$files',
        has: 'one',
        label: 'profile',
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
```

Similarly open `instant.perms.ts` and replace the contents with the following

```javascript
// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  "$files": {
    "allow": {
      "view": "true",
      "create": "isLoggedIn && isOwner",
      "delete": "isLoggedIn && isOwner"
    },
    "bind": [
      "isLoggedIn", "auth.id != null",
      "isOwner", "data.path.startsWith(auth.id + '/')"
    ]
  }
} satisfies InstantRules;

export default rules;
```

Push up both the schema and permissions to your Instant app with the following command

```shell {% showCopy=true %}
npx instant-cli@latest push
```

With your schema, permissions, and application code set, you can now run your app!

```shell {% showCopy=true %}
npm run dev
```

Go to `localhost:3000` and you should see a login screen. Log in with your email
and magic code. You'll now see a page for uploading avatars. Huzzah!

### Reference

The main files to look at are

* [**instant.schema.ts**][1] - Defines `$users`, `$files`, `profiles` and their
  relationships for implementing avatar uploads.
* [**instant.perms.ts**][2] -- Locks down the `$files` table to only allow users to
  upload their own files.
* [**app/page.tsx**][3] - The main page of the app. It contains the form for uploading
  the avatar image and the logic for displaying the uploaded image.
* [**app/db.tsx**][4] - Exports the `db` instance for other parts of the app to use.


To learn more, see [InstantDB's storage docs.](https://instantdb.com/docs/storage)
info on get this example up and running.

[1]: https://github.com/jsventures/instant-storage-avatar-example/blob/main/instant.schema.ts
[2]: https://github.com/jsventures/instant-storage-avatar-example/blob/main/instant.perms.ts
[3]: https://github.com/jsventures/instant-storage-avatar-example/blob/main/app/page.tsx
[4]: https://github.com/jsventures/instant-storage-avatar-example/blob/main/app/db.tsx
