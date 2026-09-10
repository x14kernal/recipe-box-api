# API Endpoint Inventory

## Response Envelope (resolved)

- **Success:** `{ success: true, data: T, meta: M }`. `meta` is **always present** — it's `{}` for single-resource/non-paginated endpoints, or a `PaginationMeta` object (`page`, `limit`, `total`, `prev`, `next`) for paginated collections.
- **Error:** `{ success: false, error: { message, code, details? } }`. `details`, when present, is an array of `{ field, message }` — used for validation errors.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Create a new user account |
| POST | `/auth/login` | No | Authenticate a user and start a new session |
| GET | `/auth/me` | Yes | Get the current authenticated user |
| POST | `/auth/logout` | Yes | End the current session (log out) |
| GET | `/recipes/mine` | Yes | List/search the current user's own recipes (public + private), excluding trashed |
| GET | `/recipes/mine/:id` | Yes | Get a single recipe owned by the current user (excluding trashed) |
| GET | `/recipes/trash` | Yes | List/search the current user's trashed recipes |
| GET | `/recipes/trash/:id` | Yes | Get a single trashed recipe owned by the current user |
| GET | `/recipes` | No | List/search public recipes |
| GET | `/recipes/:id` | No | Get a single public recipe |
| POST | `/recipes` | Yes | Create a new recipe (steps, ingredients, tags, images) |
| PATCH | `/recipes/:id` | Yes | Edit an existing recipe |
| DELETE | `/recipes/:id` | Yes | Permanently delete a recipe |
| PATCH | `/recipes/:id/trash` | Yes | Mark a recipe as trashed (soft delete) |
| PATCH | `/recipes/:id/restore` | Yes | Restore a trashed recipe |
| POST | `/recipes/:id/bookmark` | Yes | Bookmark (save) a recipe |
| DELETE | `/recipes/:id/bookmark` | Yes | Remove a recipe from bookmarks |
| GET | `/bookmarks` | Yes | List the current user's bookmarked recipes |
| GET | `/sessions` | Yes | List the current user's active sessions |
| DELETE | `/sessions/:id` | Yes | Log out from one specific session |

---

## `POST /auth/register`

**Purpose:** Create a new user account.

**Auth:** No

**Body**:

- `email` — string, trimmed + lowercased
- `username` — string, trimmed + lowercased
- `displayName` — string, nullable (required key, but the value can be `null`)
- `password` — string, 8–24 chars

**Example:**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "jane@example.com",
  "username": "janedoe",
  "displayName": "Jane Doe",
  "password": "correcthorse"
}
```

**Response:** `201` — does not auto-log-in (no session cookie set); call `POST /auth/login` afterward.

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "username": "string",
    "displayName": "string | null"
  },
  "meta": {}
}
```

## `POST /auth/login`

**Purpose:** Authenticate a user and start a new session.

**Auth:** No

**Body**:

- `identifier` — string, trimmed + lowercased (email or username — schema doesn't distinguish, so the lookup presumably tries both)
- `password` — string, 8–24 chars

**Example:**

```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "jane@example.com",
  "password": "correcthorse"
}
```

**Response:** `200` — no JWT. Sets an httpOnly `session` cookie whose value is a token; the token is hashed with bcrypt and stored in a new `user_session` row (`session_token_hash`, `ip_address`, `user_agent`, `expires_at`) so each device's session can be checked/revoked independently.

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "username": "string",
    "displayName": "string | null"
  },
  "meta": {}
}
```

## `GET /auth/me`

**Purpose:** Get the current authenticated user.

**Auth:** Yes

**Body:** None

**Response:** `200`

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "username": "string",
    "displayName": "string | null"
  },
  "meta": {}
}
```

## `POST /auth/logout`

**Purpose:** End the current session (log out).

**Auth:** Yes

**Body:** None — acts on the current session (identified via the httpOnly `session` cookie).

**Example:**

```http
POST /auth/logout
```

**Response:** `200` — likely also clears the cookie and deletes/invalidates the matching `user_session` row (not confirmed from the schemas).

```json
{ "success": true, "data": null, "meta": {} }
```

## `GET /recipes/mine`

**Purpose:** List and search the current user's own recipes (public and private), excluding trashed ones.

**Auth:** Yes

**Query params** (from `listRecipesQuerySchema` — same for `/recipes/mine`, `/recipes/trash`, `/recipes`, `/bookmarks`):

- `page` — int, min 1, default `1`
- `limit` — int, 1–100, default `10`
- `ingredients` — comma-separated ingredients; **ALL must match**
- `tags` — comma-separated tags; **ANY must match**
- `search` — string, max 100 chars
- `sortBy` — `title` | `createdAt` | `servingSize`, default `createdAt`
- `order` — `asc` | `desc`, default `desc`

**Example:**

```http
GET /recipes/mine?search=pasta&tags=vegan&limit=20
```

**Response:** `200` — includes both public and private recipes owned by the current user; trashed recipes excluded. List endpoints return the slim `RecipeListItem` shape below (no ingredients/steps) — fetch `GET /recipes/mine/:id` for the full recipe.

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "ownerId": "string",
      "title": "string",
      "servingSize": 4,
      "visibility": "public",
      "createdAt": "string",
      "user": {
        "id": "string",
        "username": "string",
        "displayName": "string | null"
      },
      "coverImage": { "imageUrl": "string", "id": "string" } ,
      "tags": [{ "name": "string", "id": "string", "slug": "string" }]
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 0, "prev": null, "next": null }
}
```

## `GET /recipes/mine/:id`

**Purpose:** Get a single recipe owned by the current user (excluding trashed recipes).

**Auth:** Yes

**Path params:**

- `id` (schema calls this `recipeId`, but the URL segment is `:id`) — ID of the recipe

**Example:**

```http
GET /recipes/mine/42
```

**Response:** `200` — the owner's own `email` is omitted from the embedded `user` object even on their own recipe.

```json
{
  "success": true,
  "data": {
    "id": "string",
    "ownerId": "string",
    "title": "string",
    "servingSize": 4,
    "visibility": "public",
    "createdAt": "string",
    "updatedAt": "string",
    "tags": [{ "id": "string", "name": "string", "slug": "string" }],
    "ingredients": [
      { "id": "string", "name": "string", "slug": "string", "quantity": 2, "unit": "cup", "image": "string | null" }
    ],
    "images": [{ "id": "string", "imageUrl": "string" }],
    "steps": [{ "id": "string", "position": 1, "description": "string", "image": "string | null" }],
    "user": { "id": "string", "username": "string", "displayName": "string | null" }
  },
  "meta": {}
}
```

## `GET /recipes/trash`

**Purpose:** List and search the current user's trashed recipes.

**Auth:** Yes

**Query params:** Same as `GET /recipes/mine` (see above) — `page`, `limit`, `ingredients`, `tags`, `search`, `sortBy`, `order`.

**Example:**

```http
GET /recipes/trash?search=soup&limit=20
```

**Response:** `200` — only returns recipes owned by the current user that are currently trashed. Same `RecipeListItem`/`PaginationMeta` shape as `GET /recipes/mine`.

## `GET /recipes/trash/:id`

**Purpose:** Get a single trashed recipe owned by the current user.

**Auth:** Yes

**Path params:**

- `id` (`recipeId` in schema) — ID of the recipe

**Example:**

```http
GET /recipes/trash/17
```

**Response:** `200` — same full `Recipe` shape as `GET /recipes/mine/:id`.

## `GET /recipes`

**Purpose:** List and search public recipes.

**Auth:** No

**Query params:** Same as `GET /recipes/mine` (see above).

**Example:**

```http
GET /recipes?ingredients=tomato,garlic&tags=vegan,dinner
```

**Response:** `200` — only returns recipes marked public. Same `RecipeListItem`/`PaginationMeta` shape as `GET /recipes/mine`.

## `GET /recipes/:id`

**Purpose:** Get a single public recipe.

**Auth:** No

**Path params:**

- `id` (`recipeId` in schema) — ID of the recipe

**Example:**

```http
GET /recipes/58
```

**Response:** `200` — same full `Recipe` shape as `GET /recipes/mine/:id`.

## `POST /recipes`

**Purpose:** Create a new recipe, including its steps, ingredients, tags, and images.

**Auth:** Yes

**Body** (all fields required):

- `title` — string, 4–200 chars
- `servingSize` — coerced int, 1–1000
- `visibility` — `'public'` | `'private'` — no default; must be explicitly provided
- `ingredients` — array, 1–50 items. Each item is either:
  - `{ id, quantity, unit }` — link to an existing dictionary `Ingredient`, or
  - `{ name, image?, quantity, unit }` — create a new dictionary `Ingredient` and link it in the same step
- `tags` — array, 1–10 items. Each item is either `{ id }` (existing `Tag`) or `{ name }` (create new)
- `images` — array, 1–10 items: `{ imageUrl }`
- `steps` — array, 1–50 items: `{ description, image? }` — no explicit `position` field on create; position is presumably assigned server-side from array order

**Example:**

```http
POST /recipes
Content-Type: application/json

{
  "title": "Grandma's Tomato Soup",
  "servingSize": 4,
  "visibility": "public",
  "ingredients": [
    { "name": "tomato", "quantity": 6, "unit": "whole" },
    { "id": "ing_123", "quantity": 2, "unit": "tbsp" }
  ],
  "tags": [
    { "name": "vegan" },
    { "id": "tag_456" }
  ],
  "images": [
    { "imageUrl": "https://example.com/soup.jpg" }
  ],
  "steps": [
    { "description": "Chop the tomatoes." },
    { "description": "Simmer for 20 minutes." }
  ]
}
```

**Response:** `201` — requires at least 1 ingredient, 1 image, 1 tag, and 1 step (all arrays have `min(1)`). Full `Recipe` shape, same as `GET /recipes/mine/:id`.

## `PATCH /recipes/:id`

**Purpose:** Edit an existing recipe, including its steps, ingredients, tags, and images.

**Auth:** Yes

**Path params:**

- `id` (`recipeId` in schema) — ID of the recipe

**Body** (all fields optional):

- `title`, `servingSize`, `visibility` — optional, same constraints as create
- `images` — optional array, max 10: each item is `{ imageUrl, id? }`. Passing `id` presumably keeps/references an existing image; omitting it adds a new one.
- `steps` — optional array, **min 1 if included**, max 50: each item is `{ description, image? }` — reuses the new-step shape, not the existing-step shape (`id`/`position`). This suggests `PATCH` replaces the entire step list wholesale rather than editing individual steps by id — inferred from the schema, not confirmed.
- `ingredients` — optional array, **min 1 if included**, max 50, same existing-vs-new union as create
- `tags` — optional array, **min 1 if included**, max 10, same existing-vs-new union as create

**How updating `ingredients` and `tags` works:**

1. If you don't send `ingredients` or `tags` at all, they stay as they are — nothing changes.
2. If you do send one of them, it fully replaces what's there — it does not merge with the old list.
3. First, all current ingredients (or tags) are removed from the recipe.
4. Then, only the ones in your request are added back.
5. So the array you send must be the **complete list** you want — not just the new or changed items. Anything you leave out gets removed.
6. Each array needs at least 1 item if you include it, so you can't send an empty list to clear all ingredients or tags.

The same applies to `steps`: if you don't send it, the existing steps stay unchanged; if you do, it replaces the whole list.

**Example:**

```http
PATCH /recipes/58
Content-Type: application/json

{
  "title": "Grandma's Tomato Soup (v2)",
  "tags": [
    { "id": "tag_456" },
    { "name": "comfort-food" }
  ]
}
```

**Response:** `200` — full `Recipe` shape, same as `GET /recipes/mine/:id`.

## `DELETE /recipes/:id`

**Purpose:** Permanently delete a recipe.

**Auth:** Yes

**Path params:**

- `id` — ID of the recipe

**Example:**

```http
DELETE /recipes/58
```

**Response:** `200`

```json
{ "success": true, "data": null, "meta": {} }
```

## `PATCH /recipes/:id/trash`

**Purpose:** Mark a recipe as trashed (soft delete).

**Auth:** Yes

**Path params:**

- `id` — ID of the recipe

**Body:** None

**Example:**

```http
PATCH /recipes/58/trash
```

**Response:** `200` — sets `deleted_at` on the `recipes` row.

```json
{ "success": true, "data": null, "meta": {} }
```

## `PATCH /recipes/:id/restore`

**Purpose:** Restore a trashed recipe.

**Auth:** Yes

**Path params:**

- `id` — ID of the recipe

**Body:** None

**Example:**

```http
PATCH /recipes/58/restore
```

**Response:** `200` — clears `deleted_at` on the `recipes` row.

```json
{ "success": true, "data": null, "meta": {} }
```

## `POST /recipes/:id/bookmark`

**Purpose:** Bookmark (save) a recipe.

**Auth:** Yes

**Path params:**

- `id` — ID of the recipe to bookmark

**Body:** None

**Example:**

```http
POST /recipes/58/bookmark
```

**Response:** `200` — the `@@unique([user_id, recipe_id])` constraint on the underlying `user_bookmark` model means bookmarking an already-bookmarked recipe will hit a DB conflict unless handled explicitly — unconfirmed whether that surfaces as an error or a no-op.

```json
{ "success": true, "data": null, "meta": {} }
```

## `DELETE /recipes/:id/bookmark`

**Purpose:** Remove a recipe from the current user's bookmarks.

**Auth:** Yes

**Path params:**

- `id` — ID of the recipe to unbookmark

**Example:**

```http
DELETE /recipes/58/bookmark
```

**Response:** `200`

```json
{ "success": true, "data": null, "meta": {} }
```

## `GET /bookmarks`

**Purpose:** List the current user's bookmarked (saved) recipes.

**Auth:** Yes

**Example:**

```http
GET /bookmarks
```

**Response:** `200` — item shape unresolved (same gap as `POST /recipes/:id/bookmark` — no `Bookmark` type provided). `meta` presumably `PaginationMeta` if this supports the same query params as recipe listings — unconfirmed.

## `GET /sessions`

**Purpose:** List the current user's active sessions.

**Auth:** Yes

**Example:**

```http
GET /sessions
```

**Response:** `200` — `isCurrent` flags the session making the request. `ip_address` exists on the underlying `user_session` Prisma model but is **not** included below — IP appears deliberately withheld from clients, worth confirming that's intentional. `meta` presumably `PaginationMeta` or `{}` — unconfirmed, sessions aren't paginated in the query schema.

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userAgent": "string",
      "expiresAt": "string",
      "createdAt": "string",
      "lastSeenAt": "string",
      "isCurrent": true
    }
  ],
  "meta": {}
}
```

## `DELETE /sessions/:id`

**Purpose:** Log out from one specific session (e.g. revoke a session on another device).

**Auth:** Yes

**Path params:**

- `id` — ID of the session to revoke

**Example:**

```http
DELETE /sessions/9
```

**Response:** `200` — whether this is allowed to target the current session (functioning like `POST /auth/logout`), or is restricted to other sessions only, is unconfirmed.

```json
{ "success": true, "data": null, "meta": {} }
```
