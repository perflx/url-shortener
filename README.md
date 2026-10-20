# URL Shortener

A URL shortening service built with TypeScript and Express. Think Bitly, but yours.

The backend is done, tested and deployed. A frontend is planned.

## Live demo

API base URL: **https://url-shortener-d53t.onrender.com**

> The API runs on Render's free tier, which puts the service to sleep after a period of inactivity. The first request after a pause can take up to a minute while it wakes up; later requests are fast.

Try it:

```bash
# register and log in
curl -X POST https://url-shortener-d53t.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "me@example.com", "password": "secret123"}'

curl -X POST https://url-shortener-d53t.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "me@example.com", "password": "secret123"}'
# -> {"token": "<jwt>"}

# shorten a link
curl -X POST https://url-shortener-d53t.onrender.com/links \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"link": "https://example.com/some/very/long/path"}'
```

Open the returned short URL in a browser and you get redirected.

## Stack

- **TypeScript** + **Express 5**
- **PostgreSQL** (Neon) + **Prisma**
- **JWT** + **bcrypt** for auth
- **Zod** for request validation
- **express-rate-limit** for rate limiting
- **nanoid** for short codes
- **Vitest** + **Supertest** for tests
- **Render** for hosting

## Features

- Register / login with JWT auth (24h token); passwords must be 8-72 characters
- Shorten any http/https URL (`https://` is added if missing)
- Redirect via 8-character short code
- Click counter per link
- View all your links
- Request validation with Zod; URLs are normalized and checked separately (only http/https, max 2048 characters)
- Rate limiting: attempts on the auth endpoints are limited per IP, and each user can create at most 10 links per 24 hours
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

### Scripts

| Script          | What it does                                           |
| --------------- | ------------------------------------------------------ |
| `npm run dev`   | Start the dev server with auto-reload                  |
| `npm run build` | Generate the Prisma client and compile TypeScript      |
| `npm start`     | Run the compiled server from `dist/`                   |
| `npm test`      | Run the test suite once                                |

## Tests

The tests use [Vitest](https://vitest.dev) and [Supertest](https://github.com/ladjs/supertest) and run against a real PostgreSQL database, sending HTTP requests straight to the Express app.

```bash
cp .env.example .env.test
# put the connection string of a SEPARATE test database in .env.test

# apply migrations to the test database
npx dotenv -e .env.test -- npx prisma migrate deploy

npm test
```

**Important:** the tests delete all users and links before and after running, so `.env.test` must point to a dedicated test database (for example a separate Neon branch), never to your real data.

What is covered:

- **Register:** success, duplicate email (409), invalid email, too short / too long password, empty body (400)
- **Login:** success, unknown email and wrong password (401), invalid input (400)
- **Links:** creating a link, invalid input (400), missing token (401), daily limit of 10 links (429)
- **Redirect:** existing short code redirects (302), unknown code returns 404

The rate limiter for the auth endpoints is disabled when `NODE_ENV=test`, so the suite is not blocked by it.

## Deployment

The API is deployed on [Render](https://render.com) as a Web Service, connected to this GitHub repository. The database is hosted on [Neon](https://neon.tech).

- **Build command:** `npm install --include=dev && npm run build && npx prisma migrate deploy`
- **Start command:** `npm start`
- **Environment variables:** everything listed in `.env.example`, set in the Render dashboard (a strong `JWT_SECRET`, the production `DATABASE_URL`, and the public base URL of the service). `PORT` is provided by Render.

`npm run build` runs `prisma generate` before compiling, so the Prisma client is created fresh on every deploy, and `prisma migrate deploy` applies any pending migrations.

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

### Errors

| Status | When                                                          |
| ------ | ------------------------------------------------------------- |
| 400    | Invalid input or URL, URL longer than 2048                    |
| 401    | Wrong credentials, missing or invalid token                   |
| 404    | User or short link not found                                  |
| 409    | Email already registered                                      |
| 429    | Too many requests, or the daily limit of 10 links is reached  |
| 500    | Unexpected server error                                       |

## Project Structure

```
prisma/        # schema and migrations
src/
  auth/        # register, login, JWT middleware
  links/       # create and list links
  redirect/    # short URL redirect + click counter
  shared/      # prisma client, config, error classes
  app.ts       # Express app: middleware, routes, error handler
  server.ts    # starts the HTTP server
tests/         # Vitest + Supertest tests
```

## Roadmap

- [x] Request validation with Zod and tests
- [x] Deploy with a public demo link
- [ ] Frontend (React + TypeScript)
- [ ] Docker (Dockerfile + compose)
- [ ] Handle short code collisions by retrying on unique constraint error