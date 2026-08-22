# Recipe Box API

A REST API for storing, managing, and searching recipes using **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.

The API lets you:

- Get all recipes
- Get one recipe
- Create a recipe
- Update a recipe
- Delete a recipe
- Filter recipes by tag
- Search recipes by ingredient
- Paginate recipe results
- Get a random recipe
- Sign up for a new account
- Log in to an existing account
- Store recipes in PostgreSQL
- Manage recipe tags with a many-to-many relationship

## Live Demo

**Demo URL:** <https://recipe-box-api-x-azure.vercel.app/>

The API is deployed on **Vercel** and uses **Neon PostgreSQL** for persistent database storage.

The deployed API supports the same recipe functionality as the local API because data is stored in PostgreSQL rather than the server's local filesystem.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Zod
- Prisma
- PostgreSQL
- Neon
- dotenv
- CORS
- pnpm

## API Endpoints

| Method | Path                  | Description                                        | Local | Live Demo |
| ------ | --------------------- | -------------------------------------------------- | :---: | :-------: |
| GET    | `/`                   | API information                                    |  ✅   |    ✅     |
| GET    | `/api/recipes`        | Get recipes with optional filtering and pagination |  ✅   |    ✅     |
| GET    | `/api/recipes/random` | Get a random recipe                                |  ✅   |    ✅     |
| GET    | `/api/recipes/:id`    | Get one recipe                                     |  ✅   |    ✅     |
| POST   | `/api/recipes`        | Create a recipe                                    |  ✅   |    ✅     |
| PATCH  | `/api/recipes/:id`    | Update a recipe                                    |  ✅   |    ✅     |
| DELETE | `/api/recipes/:id`    | Delete a recipe                                    |  ✅   |    ✅     |
| POST   | `/api/auth/signup`    | Sign up for a new account                          |  ✅   |    ✅     |
| POST   | `/api/auth/login`     | Log in to an existing account                      |  ✅   |    ✅     |
| GET    | `/api/auth/me`        | Get the currently authenticated user               |  ✅   |    ✅     |

## Query Parameters

The `GET /api/recipes` endpoint supports:

| Parameter    | Description                  | Default |
| ------------ | ---------------------------- | ------- |
| `tag`        | Filter recipes by tag        | None    |
| `ingredient` | Filter recipes by ingredient | None    |
| `page`       | Page number                  | `1`     |
| `limit`      | Number of recipes per page   | `10`    |

The maximum `limit` is `30`.

Filters can be combined with each other and with pagination.

## Example Requests

### Get all recipes

```http
GET http://localhost:3000/api/recipes
```

### Filter by tag

```http
GET http://localhost:3000/api/recipes?tag=mexican
```

### Filter by ingredient

```http
GET http://localhost:3000/api/recipes?ingredient=eggs
```

### Filter by ingredient and tag

```http
GET http://localhost:3000/api/recipes?ingredient=cilantro&tag=mexican
```

### Filter with no matching recipes

```http
GET http://localhost:3000/api/recipes?tag=not-exist
```

### Paginate recipes

```http
GET http://localhost:3000/api/recipes?page=2&limit=5
```

### Filter and paginate

```http
GET http://localhost:3000/api/recipes?ingredient=eggs&tag=mexican&page=2&limit=5
```

The response includes:

- `data` — recipes for the current page
- `page` — current page number
- `limit` — recipes per page
- `total` — total number of recipes after filtering
- `prev` — URL for the previous page, or `null`
- `next` — URL for the next page, or `null`

### Get one recipe

```http
GET http://localhost:3000/api/recipes/10000000-0000-0000-0000-000000000001
```

### Get a random recipe

```http
GET http://localhost:3000/api/recipes/random
```

### Create a recipe

```http
POST http://localhost:3000/api/recipes
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Classic Pan",
  "ingredients": [
    "Flour",
    "Baking powder"
  ],
  "steps": [
    "Mix",
    "Serve"
  ],
  "tags": [
    "breakfast",
    "healthy",
    "quick"
  ]
}
```

### Update a recipe

```http
PATCH http://localhost:3000/api/recipes/10000000-0000-0000-0000-000000000001
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Lentil Soup Updated",
  "ingredients": [
    "Red lentils",
    "Onion",
    "Vegetable broth"
  ],
  "steps": [
    "Simmer",
    "Blend"
  ],
  "tags": [
    "soup",
    "healthy",
    "vegan"
  ]
}
```

### Delete a recipe

```http
DELETE http://localhost:3000/api/recipes/10000000-0000-0000-0000-000000000004
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Sign up for a new account

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "muhammed@example.com",
  "password": "password$"
}
```

### Log in

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "heba@example.com",
  "password": "password"
}
```

### Get current authenticated user

````http
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN


{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "email"
  }
}
```

### Log in with invalid credentials

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "heba@example.com",
  "password": "wrong-password"
}
````

## Database

The API uses **PostgreSQL** hosted by **Neon** and accessed through **Prisma**.

The database contains:

- `User`
- `Recipe`
- `Tag`
- `RecipeTag`

`Recipe` and `Tag` have a many-to-many relationship through `RecipeTag`.

Recipe tags are provided as tag names by the API and existing tags are reused while new tags are created when necessary.

The `Recipe.userId` field is indexed for efficient lookups by user.

The `/api/auth/signup` and `/api/auth/login` endpoints create and check rows in the `User` table.

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV={"development" | "production"}
DATABASE_URL="your-neon-pooled-connection-string"
JWT_SECRET="your-jwt-secret"
```

Do not commit the `.env` file to Git.

## Database Setup

Install dependencies:

```bash
pnpm install
```

Apply Prisma migrations:

```bash
pnpm prisma migrate dev
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Seed the database:

```bash
pnpm prisma db seed
```

To inspect the database locally:

```bash
pnpm prisma studio
```

## Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/x14kernal/recipe-box-api
cd recipe-box-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Check `.env.example`.
Create your `.env`.

Do not commit the `.env` file to Git.

### 4. Set up the database

```bash
pnpm prisma migrate dev
pnpm prisma generate
pnpm prisma db seed
```

### 5. Start the server

```bash
pnpm dev
```

The API runs at:

```text
http://localhost:3000
```

## Data Storage

Recipes are stored in **PostgreSQL**, not in a local JSON file.

Prisma is responsible for communicating with the PostgreSQL database.

Database schema changes are tracked through Prisma migrations in `prisma/migrations/`.

Seed data is managed through `prisma/seed.ts`.

## Validation and Errors

The API validates recipe data before creating or updating a recipe.

| Status | Description                                                       |
| ------ | ----------------------------------------------------------------- |
| `201`  | Recipe created successfully                                       |
| `204`  | Recipe deleted successfully                                       |
| `400`  | Invalid request data                                              |
| `401`  | Missing or invalid authentication credentials                     |
| `404`  | Recipe not found                                                  |
| `409`  | Cannot delete recipe because it is referenced by another resource |

## Nice-to-Have Features

Implemented features:

- ✅ Random recipe endpoint
- ✅ Search by ingredient
- ✅ Pagination
- ✅ Combined tag and ingredient filtering
- ✅ User signup and login

## Definition of Done

- [x] All 5 core routes work correctly.
- [x] Invalid input returns `400`.
- [x] Missing recipe returns `404`.
- [x] Data persists through PostgreSQL.
- [x] `.env` is used and not committed.
- [x] CORS is configured.
- [x] Request logging middleware is implemented.
- [x] Controllers are separated from routes.
- [x] README documents every endpoint with examples.
- [x] Prisma is integrated with PostgreSQL.
- [x] Neon is used for persistent database storage.
- [x] Prisma migrations are configured.
- [x] Prisma seed data is configured.
- [x] Random recipe endpoint.
- [x] Ingredient search.
- [x] Pagination.
- [x] Combined tag and ingredient filtering.
- [x] JSON-file storage has been removed.
- [x] Recipe tags use the relational database model.
- [x] Deployed API uses persistent PostgreSQL storage.
