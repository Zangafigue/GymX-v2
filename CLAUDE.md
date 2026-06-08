# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b (typecheck) THEN vite build — typecheck failure aborts the build
npm run lint      # ESLint (flat config, eslint.config.js)
npm run preview   # Serve the production build locally
```

There is no test runner configured — no test command, no test files. `npm run build` (typecheck + Vite build) is the CI/Vercel gate; `npm run lint` is separate and not run by Vercel.

**PWA deferred:** [vite.config.ts](vite.config.ts) is intentionally minimal (React plugin + `@`→`/src` alias). The PWA setup (`vite-plugin-pwa`) was removed because it is not Vite 8 / rolldown ready and PWA is a later roadmap phase — the manifest meta tags and `/public/icons/*` assets remain in place for when it is reintroduced.

**Bundle size:** the build emits a single ~1.1 MB JS chunk and prints a >500 kB warning (non-blocking). Code-splitting via dynamic `import()` is the eventual fix.

## Architecture

React 19 + TypeScript + Vite SPA. Backend is **Supabase** (Postgres + Auth + RLS + Edge Functions). Tailwind CSS **v4**. Deployed on Vercel ([vercel.json](vercel.json) rewrites all routes to `index.html` for client-side routing).

### Provider hierarchy (order matters)

[src/App.tsx](src/App.tsx) nests: `ThemeProvider → I18nProvider → AuthProvider → ToastProvider → ConfirmProvider → Router`. New global providers go inside this chain; anything using `useToast`/`useConfirm` must sit below them.

### Routing & RBAC

- Public pages (Landing, Login, Register, password reset) render under [MainLayout](src/components/layouts/MainLayout.tsx) (Navbar + Footer).
- Authenticated pages render under [DashboardLayout](src/components/layouts/DashboardLayout.tsx) (Sidebar + header), gated by [ProtectedRoute](src/components/ProtectedRoute.tsx).
- `/dashboard/*` → members; `/admin/*` → `<ProtectedRoute adminOnly>` (redirects non-admins to `/`).
- [AuthContext](src/context/AuthContext.tsx) holds the session and fetches `role` from the `profiles` table on auth change. `useAuth()` ([src/hooks/useAuth.tsx](src/hooks/useAuth.tsx)) exposes `{ user, role, loading, signOut }`.

### Data layer — `src/lib/api.ts`

**All** Supabase reads/writes go through namespaced API objects in [src/lib/api.ts](src/lib/api.ts): `authApi`, `profilesApi`, `classesApi`, `bookingsApi`, `locationsApi`, `trainersApi`, `notificationsApi`. Convention: functions **throw** on error and return data directly (a few legacy methods like `profilesApi.updateName` and `bookingsApi.cancel` return `{ data, error }` instead — match the surrounding method when editing). Do not call `supabase.from(...)` directly from components; add a method to `api.ts`.

**Sensitive mutations bypass direct table writes and call Edge Functions** for atomicity. `bookingsApi.create`/`bookingsApi.cancel` invoke the `create-booking`/`cancel-booking` functions so capacity checks, duplicate-booking prevention, in-app notifications, and confirmation emails happen server-side. Plain admin CRUD (classes, locations, trainers) writes to tables directly under RLS.

### Custom hooks pattern

[src/hooks/](src/hooks/) (`useClasses`, `useBookings`, `useProfile`) are the intended consumption layer for pages. Each wraps `api.ts` calls + `useToast` + `useTranslation` + `getErrorMessage`, and manages its own `loading`/per-item action state. Prefer extending/using these hooks over re-implementing fetch logic in a page.

### Supabase Edge Functions — `supabase/functions/`

Deno runtime, imports via `https://esm.sh/...`. Shared helpers in `_shared/`: [cors.ts](supabase/functions/_shared/cors.ts) (handle `OPTIONS` + spread `corsHeaders` on every response) and [auth.ts](supabase/functions/_shared/auth.ts) (`getAuthenticatedUser(req)`, `requireAdmin(req)`). Functions create a **service-role** client (`SUPABASE_SERVICE_ROLE_KEY`) to bypass RLS for validation, while authenticating the caller via the request's `Authorization` header. Functions: `create-booking`, `cancel-booking`, `create-subscription`, `send-email`, `send-class-reminders`. DB schema/RLS migrations live in `supabase/migrations/`.

### Design system

Two layered systems coexist — prefer the token system:

1. **Token system (preferred):** [src/styles/tokens.css](src/styles/tokens.css) defines all visual tokens as CSS variables (`--color-*`, `--space-*`, `--radius-*`, `--z-*`, etc.). Dark is the default; light mode overrides via `[data-theme="light"]`. [ThemeContext](src/context/ThemeContext.tsx) sets `data-theme` on `<html>`. Reusable component classes (`.btn-primary`, `.card`, `.glass-card`, `.badge-*`, `.input-base`) live in `@layer components` of [src/styles/index.css](src/styles/index.css).
2. **Legacy Tailwind colors:** `gym-red`/`gym-black`/`gym-gray`/`gym-slate` (still used in layouts/ProtectedRoute). Because this is Tailwind v4, these are made available via the `@theme` block in [src/styles/index.css](src/styles/index.css), **not** [tailwind.config.js](tailwind.config.js) (v4 does not auto-load the JS config — that file is effectively legacy).

[src/main.tsx](src/main.tsx) imports `styles/index.css` as the single style entry point. Animations via Framer Motion; charts via Recharts; icons via `lucide-react`.

### i18n

[I18nContext](src/context/I18nContext.tsx) — `useTranslation()` returns `{ language, setLanguage, t }`. `t('nav.home')` resolves nested keys from [src/translations/en.json](src/translations/en.json) / [fr.json](src/translations/fr.json) with `{var}` interpolation and `{ returnObjects: true }` support. **FR is the default/fallback** (missing key → EN fallback → raw key). Note: hooks/components frequently use inline `language === 'fr' ? ... : ...` ternaries for one-off strings rather than `t()`.

### Errors & types

- [src/lib/errors.ts](src/lib/errors.ts) — `getErrorMessage(err, language)` maps Supabase/Postgres error codes (e.g. `42501` RLS, `23505` duplicate) to localized messages. Pair every caught error with this + a toast.
- [src/types/index.ts](src/types/index.ts) is the single source of truth for domain types, mirroring Supabase tables. Form types are derived via `Omit` (e.g. `GymClassFormData`).

## Conventions & gotchas

- **Role type is inconsistent.** `types/index.ts` declares `Role = 'admin' | 'member'`, but `AuthContext` uses `'admin' | 'user' | null`. RBAC checks only ever compare against `'admin'`, so non-admins work regardless — but be deliberate about which type you import.
- **Path alias `@` → `/src`** is configured in [vite.config.ts](vite.config.ts), though most existing imports are relative.
- Comments and many user-facing strings are in **French**; match the local style of the file you're editing.
- Env vars are `VITE_`-prefixed (client-exposed): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see [.env.example](.env.example)). The Resend API key must **never** be a `VITE_` var — email sending in production goes through the `send-email` Edge Function ([src/lib/email.ts](src/lib/email.ts) mocks to console in dev).
