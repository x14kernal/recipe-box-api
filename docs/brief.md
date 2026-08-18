# Project brief

## Recipe Box API v1

**Problem it solves:** lets someone store, organize, and search their own recipes through a clean API — the foundation for a bigger app you'll build across the next 3 phases.

**Must-have features:**

1. List all recipes (`GET /api/recipes`).
2. Get one recipe by ID (`GET /api/recipes/:id`).
3. Create a recipe, with validation (`POST /api/recipes`).
4. Update a recipe (`PUT /api/recipes/:id`).
5. Delete a recipe (`DELETE /api/recipes/:id`).
6. Filter recipes by tag using a query parameter.
7. Data survives a server restart (saved to a JSON file).
8. Bad input is rejected with a clear `400` error, not a crash.

**Nice-to-have features:**

- A random-recipe endpoint.
- Search by ingredient name.
- Pagination on the list endpoint.

**Route outline:**

| Method | Path               | Description                         |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/api/recipes`     | List all recipes (supports `?tag=`) |
| GET    | `/api/recipes/:id` | Get one recipe                      |
| POST   | `/api/recipes`     | Create a recipe                     |
| PUT    | `/api/recipes/:id` | Update a recipe                     |
| DELETE | `/api/recipes/:id` | Delete a recipe                     |

**Data shape:**

```ts
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
}
```

**Definition of Done:**

- [x] All 5 core routes work and return the correct status codes.
- [x] Invalid input (e.g. missing title) returns a `400`, not a crash.
- [x] Requesting a recipe ID that doesn't exist returns a `404`, not a crash or a `200` with empty data.
- [x] Data survives a server restart.
- [x] `.env` is used for configuration and is not committed to Git.
- [~] API is deployed and reachable at a public URL.
- [x] README lists every endpoint with an example request.

## Recipe Box API v2

**Problem it solves:** the same recipe tool as v1, but now the data is stored in a real, structured PostgreSQL database instead of a JSON file. Tags are stored consistently, and the relational design prepares the project for real user accounts in Phase 4.

**Must-have features:**

1. `User`, `Recipe`, `Tag`, and `RecipeTag` exist as real PostgreSQL tables.
2. The relational database is designed by hand before using Prisma.
3. The initial database schema is created using raw SQL.
4. A `User` can have many `Recipe` records through `Recipe.userId`.
5. A `Recipe` can have many `Tag` records, and a `Tag` can belong to many recipes through the `RecipeTag` join table.
6. Existing tag names are reused instead of creating duplicate tags.
7. New tag names create new tags.
8. The JSON-file data layer is replaced with Prisma and PostgreSQL.
9. Prisma migrations are used to manage database schema changes.
10. An index exists on `Recipe.userId`.
11. All existing Phase 2 API functionality continues to work correctly against the PostgreSQL database:
    - CRUD operations.
    - Tag filtering.
    - Ingredient search.
    - Pagination.
    - Random recipe.

**Relational model:**

```text
User (1) ─────< Recipe (many)

Recipe (many) ─────< RecipeTag >───── Tag (many)
```

**Definition of Done:**

- [x] ER diagram is created and saved in docs/er-diagram.png.
- [x] The relational design correctly represents User → Recipe as one-to-many.
- [x] The relational design correctly represents Recipe ↔ Tag as many-to-many through RecipeTag.
- [x] The reason for using a separate Tag table is documented in docs/brief.md.
- [x] PostgreSQL contains the required users, recipes, tags, and recipe_tags tables.
- [x] I can write a basic SELECT query with WHERE, ORDER BY, and LIMIT from memory.
- [x] I can write a basic JOIN query from memory.
- [x] I can write a GROUP BY query with an aggregate function such as COUNT.
- [x] I have used EXPLAIN or EXPLAIN ANALYZE and can explain what an index changes.
- [x] prisma/schema.prisma matches the relational design.
- [x] At least one Prisma migration exists in prisma/migrations/ and is committed to Git.
- [x] A seed script creates connected sample data.
- [x] The API uses Prisma instead of the JSON-file storage layer.
- [x] `recipes.json` and the old file-based storage functions are removed.
- [x] All Phase 2 API functionality works correctly against PostgreSQL.
- [x] The same tag used by multiple recipes is stored only once in the Tag table.
- [ ] An index exists on Recipe.userId.
- [x] README is updated with the PostgreSQL, Prisma, and database setup instructions.
- [x] The deployed API's writes are verified to persist correctly with the real database.

### Entities

```text
User
- id
- email
- passwordHash
- createdAt

Recipe
- id
- title
- ingredients
- steps
- createdAt
- userId

Tag
- id
- name

RecipeTag
- recipeId
- tagId
```

### Notes

#### Why use a separate Tag table?

Because many recipes can use the same tag.

Instead of storing:

```text
Recipe
- tags: ["vegan", "quick"]
```

we store tags separately:

```mermaid
erDiagram
    RECIPE {
        string id
        string title
    }

    TAG {
        string id
        string name
    }

    RECIPE_TAG {
        string recipeId
        string tagId
    }

    RECIPE ||--o{ RECIPE_TAG : has
    TAG ||--o{ RECIPE_TAG : used_by
```

> We use a separate Tag table so tags can be reused consistently across many recipes, with RecipeTag connecting recipes and tags.

## Recipe Box API v3

**Problem it solves:** the same recipe tool, but now each person has their own private, secure collection — a real web app anyone can use, not just something you test with Thunder Client.

**Must-have features:**

1. A visitor can sign up with an email and password.
2. A registered user can log in, and stays logged in after refreshing the page.
3. A logged-in user can create, edit, and delete only their own recipes.
4. All recipes are visible to everyone (read-only) whether logged in or not — but only the owner sees edit/delete controls.
5. Passwords are hashed with `bcryptjs`, never stored as plain text.
6. The frontend shows correct loading, error, and empty states for every network call.
7. The frontend and backend are both deployed, and correctly connected, in production.

**Nice-to-have features:**

- A working "log out" that fully clears the session.
- A friendly error message (not a raw server error) when login fails.
- After logging in, redirect back to the page the user was originally trying to reach.

**Route outline (new since Phase 3):**

| Method | Path               | Protected?      | Description                     |
| ------ | ------------------ | --------------- | ------------------------------- |
| POST   | `/api/auth/signup` | No              | Create an account               |
| POST   | `/api/auth/login`  | No              | Get a token                     |
| GET    | `/api/recipes`     | No              | List all recipes                |
| GET    | `/api/recipes/:id` | No              | Get one recipe                  |
| POST   | `/api/recipes`     | Yes             | Create (owner = logged-in user) |
| PUT    | `/api/recipes/:id` | Yes, owner only | Update                          |
| DELETE | `/api/recipes/:id` | Yes, owner only | Delete                          |

**Definition of Done:**

- [ ] Signup creates a user with a hashed password (check this directly in Prisma Studio — you should never see a real password there).
- [ ] Login returns a working token; wrong credentials return `401`.
- [ ] A logged-out visitor can browse recipes, but sees no edit/delete buttons anywhere.
- [ ] Create two test accounts. Confirm, by hand, that Account A cannot edit or delete Account B's recipe.
- [ ] Refreshing the page keeps a logged-in user logged in.
- [ ] Frontend and backend are both deployed and working together at their live links.
- [ ] Both READMEs updated to describe the full-stack, connected setup.
