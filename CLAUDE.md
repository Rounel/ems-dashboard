# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Non-Standard Next.js Version

This project runs **Next.js 16.2.6** — a version with breaking changes where APIs, conventions, and file structure may differ significantly from training data. **Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`.** Heed all deprecation notices.

## Stack

- **Next.js 16.2.6** with App Router
- **React 19.2.4**
- **TypeScript 5** (strict mode, path alias `@/*` → project root)
- **Tailwind CSS 4** (via PostCSS plugin, `@import "tailwindcss"` in globals.css)
- **pnpm** (package manager — use `pnpm`, not `npm`)

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Project Structure

```
proxy.ts              # Route protection (Next.js 16 rename of middleware.ts)
app/
  (auth)/login/       # Public login page
  actions/auth.ts     # Server Actions: login(), logout()
  dashboard/          # Protected dashboard (verifies session server-side)
  lib/
    session.ts        # JWT encrypt/decrypt via jose
    dal.ts            # verifySession() — call in any Server Component to require auth
  layout.tsx          # Root layout: Geist fonts, HTML shell
  globals.css         # Tailwind import + CSS custom properties
public/               # Static assets
```

## Auth Architecture

Stateless JWT sessions stored in an httpOnly cookie (`session`).

- **`proxy.ts`**: Runs before every request. Reads the cookie directly from `request.cookies` (synchronous here), redirects unauthenticated users to `/login` and authenticated users away from `/login`.
- **`app/lib/session.ts`**: `encrypt()` / `decrypt()` using `jose` + `SESSION_SECRET` env var.
- **`app/lib/dal.ts`**: `verifySession()` — call at the top of any Server Component that requires auth. Redirects to `/login` if the session is missing or invalid.
- **`app/actions/auth.ts`**: `login()` Server Action validates credentials, writes the cookie (`await cookies()` — async in Next.js 16); `logout()` deletes it.
- **Mock users** live in `auth.ts` — replace with a real DB lookup + `bcrypt` comparison before production.

## Key Conventions

- **Path alias**: Use `@/` for imports from the project root (e.g., `@/app/components/...`).
- **Styling**: Tailwind CSS 4 — configure via `@theme` in `globals.css`, not `tailwind.config.js` (v4 uses CSS-first config).
- **`cookies()` is async in Next.js 16** — always `await cookies()` in Server Components / Server Actions.
- **Proxy, not middleware**: Route interception file is `proxy.ts`, not `middleware.ts`.
- **ESLint**: Flat config format (`eslint.config.mjs`).
- **Dark mode**: Handled via `@media (prefers-color-scheme: dark)` CSS custom properties in `globals.css`.
