# ServiceHub - NeonDB + Netlify Setup

This project now includes a production-ready backend scaffold for:

- Neon Postgres
- Prisma ORM
- Netlify Functions
- JWT auth (custom email/password)

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Copy `.env.example` to `.env` and fill in values:

- `DATABASE_URL` -> Neon connection string
- `JWT_SECRET` -> strong random secret
- `JWT_EXPIRES_IN` -> token lifetime (example: `7d`)

## 3) Prepare database

```bash
npm run prisma:generate
npm run prisma:push
```

## 4) Netlify environment variables

In Netlify Site Settings -> Environment Variables, add:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## 5) Deploy

Netlify will use `netlify.toml`:

- Build command: `npm run prisma:generate`
- Functions directory: `netlify/functions`
- Publish directory: project root

## Included backend files

- `prisma/schema.prisma` - database schema
- `netlify/functions/auth-signup.js` - register user
- `netlify/functions/auth-signin.js` - login user
- `netlify/functions/providers-list.js` - list providers
- `netlify/functions/requests-create.js` - create request
- `netlify/functions/requests-list.js` - list user/provider requests
- `netlify/functions/requests-update-status.js` - update lifecycle status
- `netlify/functions/_lib/*` - shared DB/auth/http helpers
- `api.js` - frontend API client for Netlify Functions

## Frontend integration updates

These pages now call API first, with local fallback if token/API is unavailable:

- `signup.html`
- `signin.html`
- `3request_form.html`

## Important migration note

Your existing pages still contain localStorage-heavy flows (`database.js`). This scaffold lets you move page-by-page safely. Next recommended migration targets:

1. `1seeker_dashboard.html` provider list from `providers-list`
2. `4user_requests.html` request list from `requests-list`
3. `provider_dashboard.html` + `request_details.html` status updates via `requests-update-status`
4. Messaging to DB-backed tables/functions (currently localStorage)

