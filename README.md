# Recipe Box API

A simple REST API for storing and managing recipes.

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
- Save recipes in a JSON file

## Live Demo

**Demo URL:** https://recipe-box-api-x-azure.vercel.app/

> **Note**
>
> The project is deployed on **Vercel** for demonstration purposes.
>
> Because the current version uses **JSON-file persistence**, Vercel's serverless environment cannot provide persistent filesystem storage.
>
> Therefore, only the root endpoint (`GET /`) is available in the deployed version.
>
> The complete API works correctly when running locally, where JSON-file persistence is supported.
>
> A future version of this project will use a database, allowing the full API to be deployed without these limitations.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Zod
- dotenv
- CORS
- pnpm

## API Endpoints

| Method | Path                  | Description                                        | Local | Live Demo |
| ------ | --------------------- | -------------------------------------------------- | :---: | :-------: |
| GET    | `/`                   | API information                                    |  ✅   |    ✅     |
| GET    | `/api/recipes`        | Get recipes with optional filtering and pagination |  ✅   |    ❌     |
| GET    | `/api/recipes/random` | Get a random recipe                                |  ✅   |    ❌     |
| GET    | `/api/recipes/:id`    | Get one recipe                                     |  ✅   |    ❌     |
| POST   | `/api/recipes`        | Create a recipe                                    |  ✅   |    ❌     |
| PUT    | `/api/recipes/:id`    | Update a recipe                                    |  ✅   |    ❌     |
| DELETE | `/api/recipes/:id`    | Delete a recipe                                    |  ✅   |    ❌     |

## Query Parameters

The `GET /api/recipes` endpoint supports:

| Parameter    | Description                  | Default |
| ------------ | ---------------------------- | ------- |
| `tag`        | Filter recipes by tag        | None    |
| `ingredient` | Filter recipes by ingredient | None    |
| `page`       | Page number                  | `1`     |
| `limit`      | Number of recipes per page   | `10`    |

The maximum `limit` is `30`.

Filters can be combined with pagination.

## Example Requests

### Get all recipes

```http
GET http://localhost:3000/api/recipes
```

### Filter by tag

```http
GET http://localhost:3000/api/recipes?tag=easy
```

### Filter by ingredient

```http
GET http://localhost:3000/api/recipes?ingredient=rice
```

### Filter by ingredient and tag

```http
GET http://localhost:3000/api/recipes?ingredient=rice&tag=easy
```

### Paginate recipes

```http
GET http://localhost:3000/api/recipes?page=2&limit=5
```

### Filter and paginate

```http
GET http://localhost:3000/api/recipes?ingredient=rice&tag=easy&page=2&limit=5
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
GET http://localhost:3000/api/recipes/1
```

### Get a random recipe

```http
GET http://localhost:3000/api/recipes/random
```

### Create a recipe

```http
POST http://localhost:3000/api/recipes
Content-Type: application/json

{
  "title": "Pasta",
  "ingredients": [
    "pasta",
    "tomato sauce"
  ],
  "steps": [
    "Boil the pasta",
    "Add the sauce"
  ],
  "tags": [
    "easy",
    "quick"
  ]
}
```

### Update a recipe

```http
PUT http://localhost:3000/api/recipes/1
Content-Type: application/json

{
  "title": "Easy Pasta"
}
```

### Delete a recipe

```http
DELETE http://localhost:3000/api/recipes/1
```

> **Note:** `DELETE` is disabled when `NODE_ENV=production`.

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

### 3. Create the `.env` file

Create a `.env` file in the project root:

```env
PORT=3000
```

Do not commit the `.env` file to Git.

### 4. Start the server

```bash
pnpm dev
```

The API runs at:

```text
http://localhost:3000
```

## Data Storage

Recipes are stored in `data/recipes.json`.

The data survives server restarts during local development.

This project does not use a database yet. A database will be added in a future version.

## Validation and Errors

The API validates recipe data before creating or updating a recipe.

| Status | Description                      |
| ------ | -------------------------------- |
| `201`  | Recipe created successfully      |
| `204`  | Recipe deleted successfully      |
| `400`  | Invalid request data             |
| `403`  | Delete is disabled in production |
| `404`  | Recipe not found                 |

## Nice-to-Have Features

Implemented features:

- ✅ Random recipe endpoint
- ✅ Search by ingredient
- ✅ Pagination
- ✅ Combined tag and ingredient filtering

## Definition of Done

- [x] All 5 core routes work correctly.
- [x] Invalid input returns `400`.
- [x] Missing recipe returns `404`.
- [x] Data survives server restarts.
- [x] `.env` is used and not committed.
- [x] CORS is configured.
- [x] Request logging middleware is implemented.
- [x] Controllers are separated from routes.
- [x] README documents every endpoint with examples.
- [x] Random recipe endpoint.
- [x] Ingredient search.
- [x] Pagination.
- [~] Live demo available (root endpoint only due to Vercel serverless filesystem limitations).
