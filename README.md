# URL Shortener

A URL shortening service built with TypeScript and Express. Think Bitly, but yours.

The backend is done and working. A frontend is planned.

## Stack

- **TypeScript** + **Express 5**
- **PostgreSQL** (Neon) + **Prisma**
- **JWT** + **bcrypt** for auth
- **nanoid** for short codes

## Features

- Register / login with JWT auth (24h token)
- Shorten any http/https URL (`https://` is added if missing)
- Redirect via 8-character short code
- Click counter per link
- View all your links
- Centralized error handling with typed error classes

## Getting Started

You need Node.js and a PostgreSQL database (I use Neon).

```bash
# install dependencies
npm install

# set up environment variables
cp .env.example .env
# fill in the values listed in .env.example

# run database migrations
npx prisma migrate dev

# start dev server
npm run dev
```

Server runs on `http://localhost:<PORT>` (PORT comes from `.env`).

## API

| Method | Endpoint       | Auth | Description              |
| ------ | -------------- | ---- | ------------------------ |
| POST   | /auth/register | -    | Create account           |
| POST   | /auth/login    | -    | Get JWT token            |
| GET    | /me            | ✓    | Current user info        |
| POST   | /links         | ✓    | Shorten a URL            |
| GET    | /links         | ✓    | Your links               |
| GET    | /:shortCode    | -    | Redirect to original URL |

Protected routes expect the header `Authorization: Bearer <token>`.

### Example

```bash
# register and log in
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "me@example.com", "password": "secret"}'

curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "me@example.com", "password": "secret"}'
# -> {"token": "<jwt>"}

# shorten a link
curl -X POST http://localhost:5000/links \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"link": "https://example.com/some/very/long/path"}'
```

Open the returned short URL in a browser and you get redirected.

### Errors

| Status | When                                        |
| ------ | ------------------------------------------- |
| 400    | Invalid input or URL, URL longer than 2048  |
| 401    | Wrong credentials, missing or invalid token |
| 404    | User or short link not found                |
| 409    | Email already registered                    |
| 500    | Unexpected server error                     |

## Project Structure

```
prisma/        # schema
src/
  auth/        # register, login, JWT middleware
  links/       # create and list links
  redirect/    # short URL redirect + click counter
  shared/      # prisma client, config, error classes
  server.ts    # app setup, routes, error handler
```

## Roadmap

- [ ] Request validation with Zod and tests
- [ ] Frontend (React + TypeScript)
- [ ] Docker (Dockerfile + compose)
- [ ] Deploy with a public demo link
- [ ] Handle short code collisions by retrying on unique constraint error