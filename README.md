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

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Zod
- dotenv
- CORS
- pnpm

## API Endpoints

| Method | Path                  | Description                                        |
| ------ | --------------------- | -------------------------------------------------- |
| GET    | `/api/recipes`        | Get recipes with optional filtering and pagination |
| GET    | `/api/recipes/random` | Get a random recipe                                |
| GET    | `/api/recipes/:id`    | Get one recipe                                     |
| POST   | `/api/recipes`        | Create a recipe                                    |
| PUT    | `/api/recipes/:id`    | Update a recipe                                    |
| DELETE | `/api/recipes/:id`    | Delete a recipe                                    |

### Query Parameters

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

Recipes are saved in a JSON file.

The data stays after the server stops and starts again.

This project does not use a database yet. A real database will be added in a later phase.

## Validation and Errors

The API validates recipe data before creating or updating a recipe.

For bad data, the API returns:

```text
400 Bad Request
```

If a recipe does not exist, the API returns:

```text
404 Not Found
```

A successful recipe creation returns:

```text
201 Created
```

A successful delete returns:

```text
204 No Content
```

## Nice-to-Have Features

All current nice-to-have features have been implemented:

- [x] Random recipe endpoint
- [x] Search by ingredient name
- [x] Pagination on the recipe list

## Definition of Done

- [x] All 5 core routes work and return the correct status codes.
- [x] Invalid input returns `400`, not a crash.
- [x] A recipe that does not exist returns `404`.
- [x] Data survives a server restart.
- [x] `.env` is used for configuration and is not committed to Git.
- [x] README lists every endpoint with an example request.
- [ ] The API is deployed and can be reached with a public URL.
