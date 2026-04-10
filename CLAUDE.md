# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TripSS is a Canadian travel destination discovery platform built with Next.js App Router, Supabase (PostgreSQL + PostGIS), and Drizzle ORM. It features a public-facing site for browsing places and an admin panel for CRUD management.

## Commands

```bash
npm run dev           # Dev server at localhost:3000
npm run build         # Production build
npm run lint          # Next.js linting
npm run db:push       # Sync Drizzle schema to Supabase (drizzle-kit push)
npm run db:seed       # Seed database (db/seed/seed.ts)
npx tsx scripts/seed-museums.ts   # Seed scraped museum data
```

No test runner is configured yet. Playwright is installed but no test files exist.

## Architecture

### Routing (Next.js App Router)

- `app/(public)/` — Public routes (landing, login)
- `app/(admin)/admin/` — Protected admin routes (CRUD for all entities)
- `app/actions/` — Server actions: `auth.ts`, `admin.ts`, `newsletter.ts`

### Data Flow

Server Components fetch data via Drizzle ORM → Server Actions handle mutations → `revalidatePath()` refreshes cache. Client components use `useActionState` for form state management.

### Supabase Clients (`lib/supabase/`)

- `createAdminClient()` — Service role key, bypasses RLS (server actions, seeding)
- `createAuthClient()` — Anon key, respects RLS (server components)
- `createBrowserClient()` — Client-side auth operations
- Middleware (`middleware.ts` + `lib/supabase/middleware.ts`) enforces role-based access; admin routes require `role: 'admin'` in `app_metadata`

### Database (`db/`)

- **Schema**: Drizzle table definitions in `db/schema/` with relations. 11 tables: provinces, regions, origin_cities, interests, travel_types, places, place_images, place_interests, place_best_months, ratings, newsletter_subscribers.
- **Conventions**: UUIDs for PKs, soft deletes via `deleted_at` timestamp (always filter with `.is('deleted_at', null)`), snake_case columns, PostGIS `geography` type for location.
- **No migration files committed** — schema changes are pushed directly with `drizzle-kit push`.

### Validation (`lib/validations/`)

Zod schemas validate all FormData server-side. `parseForm()` utility extracts and validates form fields. `ActionResult` type: `{ success: true } | { success: false; error: string } | null`.

### Admin UI (`app/(admin)/admin/_components/admin-ui.tsx`)

Reusable primitives: PageHeader, Card, StatCard, DataTable, ActionForm, EditableRow. Inline CSS styling throughout (no CSS framework).

## Available Skills

### Environment Management
- **dotenv** — Load environment variables from `.env` files into `process.env`. Use for local dev setup, managing API keys, parsing `.env` contents.
- **dotenvx** — Secure dotenv workflow: run commands with env vars, manage multiple `.env` files, encrypt env files for safe commits and CI/CD. Use `dotenvx run -- <command>` for any language.

### Browser Automation & Testing
- **playwright-cli** — Automate browser interactions and test web pages. Commands: `playwright-cli open`, `goto`, `click`, `fill`, `snapshot`, `screenshot`, `close`. Supports sessions, tabs, network mocking, tracing, and video recording.
- **playwright-trace** — Inspect Playwright `.zip` trace files from CLI. Commands: `npx playwright trace open <file>`, `actions`, `requests`, `console`, `errors`, `snapshot`. Use for debugging test failures without opening a browser.

### Agent Skills (via AGENTS.md)
When spawning Claude Code sessions for coding work, use gstack skills:
- `/cso` — Security audit
- `/review` — Code review
- `/qa <url>` — QA test a URL
- `/autoplan` — Plan before building
- `/ship` — Ship a feature
- `/office-hours` — Interactive planning session

## Key Patterns

- Path alias: `@/*` maps to project root
- Slugs: lowercase hyphenated, validated by Zod regex
- Database errors handled by code (23505 = duplicate, 42501 = permission)
- `requireAdmin()` guard on all admin server actions
- `query()` and `queryCount()` helpers for server component data fetching
