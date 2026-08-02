# Project brief: Recipe Box API v1

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

- [ ] All 5 core routes work and return the correct status codes.
- [ ] Invalid input (e.g. missing title) returns a `400`, not a crash.
- [ ] Requesting a recipe ID that doesn't exist returns a `404`, not a crash or a `200` with empty data.
- [ ] Data survives a server restart.
- [ ] `.env` is used for configuration and is not committed to Git.
- [ ] API is deployed and reachable at a public URL.
- [ ] README lists every endpoint with an example request.
