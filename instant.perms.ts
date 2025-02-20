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
