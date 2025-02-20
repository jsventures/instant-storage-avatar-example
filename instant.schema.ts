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
        on: "profiles",
        has: "one",
        label: "$user",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "profile",
      },
    },
    profilesAvatar: {
      forward: {
        on: "profiles",
        has: "one",
        label: "avatar",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "profile",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
