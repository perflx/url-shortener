# URL Shortener

A simple URL shortening service built with TypeScript and Express. Think Bitly, but yours.

## Stack

- **TypeScript** + **Express**
- **PostgreSQL** + **Prisma**
- **JWT** for auth
- **Docker** for local DB
- **Zod** for request validation

## Features

- Register / login with JWT auth
- Shorten any URL
- Redirect via short code
- Click counter per link
- View all your links

## Getting Started

```bash
# install dependencies
npm install

# set up environment variables
cp .env.example .env
# fill in DATABASE_URL and JWT_SECRET

# run database migrations
npx prisma migrate dev

# start dev server
npm run dev
```

Server runs on `http://localhost:5000`

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | — | Create account |
| POST | /auth/login | — | Get JWT token |
| POST | /links | ✓ | Shorten a URL |
| GET | /links | ✓ | Your links |
| GET | /:shortCode | — | Redirect to original URL |

## Project Structure

```
src/
  auth/        # register, login
  links/       # create and list links
  redirect/    # handle short URL redirects
  shared/      # prisma client, config, error classes
```