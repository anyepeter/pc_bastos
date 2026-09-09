# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bilingual (EN/FR) website for CEPCA/CPCC, a Cameroonian council of Protestant churches. Next.js 14 App Router, TypeScript, Tailwind + shadcn/ui, Prisma/PostgreSQL (Neon), self-hosted email + password auth, Cloudinary images, Redux Toolkit + i18next for language state.

## Commands

```bash
npm run dev                  # dev server
npm run build                # prisma generate && next build
npm run lint                 # next lint (NOT run during build — see next.config.js)
npx tsc --noEmit             # typecheck (the only real "test" in this repo)
npx prisma generate          # regenerate client into lib/generated/prisma
npx prisma migrate dev       # apply schema changes
npx prisma studio            # inspect the DB
```

There is no test framework. Verification = `npx tsc --noEmit` + `npm run build`.

`lib/generated/prisma` is gitignored, so `npx prisma generate` must run before typechecking a fresh checkout (`postinstall` handles it after `npm install`). ESLint is skipped during builds, so lint errors will not fail CI — run `npm run lint` explicitly.

## Architecture

### Data: two very different sources

1. **Database-backed, editable in `/admin`** — `BlogPost`, `Event`, `Announcement`, `Workshop`, `CharityProgram`, `Sermon` in [prisma/schema.prisma](prisma/schema.prisma). Every translatable attribute is a **JSON column holding `{ en, fr }`**, not a column or row per locale.
2. **Still hardcoded** — members, departments, and the remaining home-page sections keep `const xData = [...]` arrays at the top of the component. Changing that content means editing the file.

There are no migrations in `prisma/migrations`; the schema is applied with `npx prisma db push`.

### The generic admin resource layer

Everything except the blog is driven by field configs rather than hand-written forms. To add or change an attribute, edit the config — the editor, the admin list, validation and the publish rule all follow.

- [lib/admin/configs.ts](lib/admin/configs.ts) — field definitions per content type. This is the file you usually want.
- [lib/admin/resource-config.ts](lib/admin/resource-config.ts) — the `ResourceConfig` / `ResourceField` types and value narrowing helpers.
- [lib/admin/resource-service.ts](lib/admin/resource-service.ts) — isomorphic conversion + validation (`toFormValues`, `toPayload`, `findMissingField`), used by both the editor and the server.
- [lib/admin/resource-actions.ts](lib/admin/resource-actions.ts) — shared CRUD bound to a Prisma delegate, including slug de-duplication and Cloudinary cleanup of orphaned images.
- [components/admin/ResourceForm.tsx](components/admin/ResourceForm.tsx) / [ResourceTable.tsx](components/admin/ResourceTable.tsx) — the shared editor and list.
- `app/actions/<type>.ts` — thin `'use server'` wrappers binding a delegate + config to the shared CRUD. Server actions are passed straight into the client components as props.

The blog predates this layer and keeps its own [BlogPostForm](components/admin/BlogPostForm.tsx) / [BlogPostsTable](components/admin/BlogPostsTable.tsx); the behaviour is the same.

Public pages are server components that fetch published rows, serialise dates to ISO strings, and hand plain JSON to a client component which resolves text with `getTranslatedText(value, language)`. Date/time formatting lives in [lib/format.ts](lib/format.ts) and is locale-aware.

There are **no API routes** (`app/api/` does not exist). All server data flows through Server Actions in [app/actions/](app/actions/):
- [blog.ts](app/actions/blog.ts) — admin CRUD; enforces the publish rule below and calls `revalidatePath` on `/admin/blog` and `/blogs`.
- [blog-public.ts](app/actions/blog-public.ts) — published-only reads; casts the Prisma `Json` fields to `Translation`.
- [upload.ts](app/actions/upload.ts) — Cloudinary upload (5MB cap, folder `church/blog`) and delete. Updating or deleting a post deletes its old Cloudinary image.
- [translate.ts](app/actions/translate.ts) — machine translation for the admin editor. Calls Google's public translate endpoint over `fetch`, splitting on paragraph breaks so markdown survives. Do **not** use the `free-translate` package for this — it drives Puppeteer, which cannot run in a serverless action.

### The bilingual publishing rule

One rule, enforced in three places — keep them in sync if you change it:

- **English is always required.** It is the fallback everywhere (`getTranslatedText` falls back to `.en`, and the admin list shows `.en`).
- **French is required only to publish.** An editor saves an English draft, adds the French translation later, then publishes.

Enforced in three matching places per content type: the server action (`validateBlogPostInput` / `validateValues` plus the publish toggle guard), the editor (Publish button disabled, per-language status panel), and the admin list (publish toggle disabled with a tooltip).

Helpers `readTranslation` / `normalizeTranslation` / `hasTranslation` live in [lib/translations.ts](lib/translations.ts) — use `readTranslation` for anything coming out of a `Json` column, since legacy rows may hold a bare string and rendering the raw object as a React child crashes the page.

### The i18n system (two parallel mechanisms)

- **Static UI text** → i18next. Keys live in `public/locales/{en,fr}/translation.json`, imported directly by [lib/i18n.ts](lib/i18n.ts) (bundled, not fetched). Consumed with `useTranslation()` — client components only. Add a key to *both* JSON files.
- **Dynamic DB text** → the `Translation` type (`{ en, fr }`) and `getTranslatedText(value, language)` from [lib/translations.ts](lib/translations.ts).

**Redux is the single source of truth for the current language.** It lives at `state.blog.language`. `setLanguage` in [store/blogSlice.ts](store/blogSlice.ts) is what calls `i18n.changeLanguage()`; browser language detection is deliberately disabled. Never call `i18n.changeLanguage()` directly — dispatch `setLanguage` instead. [components/I18nProvider.tsx](components/I18nProvider.tsx) keeps i18next in sync with Redux.

### Redux store

Single `blog` slice ([store/blogSlice.ts](store/blogSlice.ts)) that holds both blog data and the language. It caches posts for 5 minutes (`cacheExpiry`) and short-circuits `fetchBlogPosts` when the cache is warm.

**There is exactly one store, mounted in [app/layout.tsx](app/layout.tsx). Never nest a second `StoreProvider`.** The store holds the selected language, so a nested provider puts the navigation's `LanguageSelector` and the page content on different stores and language switching silently stops working — this was a real bug on the blog pages.

SSR hydration pattern instead: the server page fetches via a Server Action and passes the result to the client component as a prop (`<BlogListClient initialPosts={...} />`, `<BlogDetailClient post={...} />`). The client renders that prop immediately and dispatches it into the shared store on mount.

### Routing / layout conventions

- Public pages wrap content in [components/PageLayout.tsx](components/PageLayout.tsx) (Navigation + Footer + WhatsAppButton). [app/page.tsx](app/page.tsx) composes those pieces manually instead.
- Server page → `Client` component split is the norm for interactive pages (`MembersClient`, `BlogDetailClient`, `WorkshopClient`, `CharityDetailClient`).
- Blog detail routes use `[id]` as the URL segment but the value is the **slug** — `generateStaticParams` maps `post.slug` into `id`.

### Auth and roles

Self-hosted email + password. Accounts are `User` rows; passwords are bcrypt hashes (cost 12, [lib/auth/password.ts](lib/auth/password.ts)). A login creates a `Session` row and sets a signed, `httpOnly`, `sameSite=lax` cookie holding only that row's id — signed with `jose` using **`SESSION_SECRET`**, which must be set in every environment. [lib/auth/session.ts](lib/auth/session.ts) exposes `getSession()` / `createSession()` / `destroySession()`; the login and logout actions live in [app/actions/auth.ts](app/actions/auth.ts) and the login page at [app/sign-in/page.tsx](app/sign-in/page.tsx).

[middleware.ts](middleware.ts) protects `/admin(.*)`. It only verifies the cookie's signature — the Edge runtime cannot reach the database — so it is a redirect convenience, not the authorisation check.

Two roles, defined in [lib/auth/roles.ts](lib/auth/roles.ts) and stored on the `User` row:

- **`super_admin`** — the council secretariat. Every content type plus church accounts.
- **`church`** — one member church. May edit only its own `MemberChurch` record, via `/admin/my-church`.

Enforced in three layers, and all three matter:

1. [app/admin/layout.tsx](app/admin/layout.tsx) resolves the role server-side and renders [AdminShell](app/admin/AdminShell.tsx) with role-specific navigation.
2. Every council page calls `requireSuperAdminPage()` (redirects a church account to `/admin/my-church`).
3. Every write action calls `requireSuperAdmin()` (throws) — centralised in [lib/admin/resource-actions.ts](lib/admin/resource-actions.ts) and [app/actions/blog.ts](app/actions/blog.ts). Church writes go through [app/actions/churches.ts](app/actions/churches.ts), where `resolveEditableChurchId` **discards any id sent by the browser** and substitutes the session's own `churchId`.

A church account is created from `/admin/churches/<id>/edit`, which writes a `User` row with role `church` and that church's id, and shows a generated temporary password **once**. There is no mailer in this project — the secretariat passes the password on by hand. `/admin/account` lets any account change its own password; `resetChurchAccountPassword` issues a new temporary one and drops every open session.

Seed or reset a super admin with `npm run create-admin` (`ADMIN_EMAIL` + `ADMIN_PASSWORD`, or two arguments). Credentials are never hardcoded.

**`SUPER_ADMIN_EMAILS`** (comma-separated) restricts who counts as super admin. While unset, any signed-in account without role metadata is treated as super admin — convenient now, but set it before launch.

## Conventions

- `'use client'` is required for anything using `useTranslation()`, Redux hooks, or React state. Server components pass translated text down as props.
- Server Actions return `{ success, data?, error? }` rather than throwing; callers check `result.success`.
- Path alias `@/*` maps to the repo root. shadcn/ui components in `components/ui/` are generated — prefer composing over editing them.
- Icons: `lucide-react`. Carousels: `swiper` and `embla-carousel-react`. Markdown: `react-markdown` + `remark-gfm`. Toasts: `sonner` (admin) / `hooks/use-toast.ts` (shadcn).
- Remote images are restricted to `res.cloudinary.com` in [next.config.js](next.config.js); add hosts there before using `next/image` with a new domain.

## Known dead/stale code

- [hooks/useBlogPosts.ts](hooks/useBlogPosts.ts) fetches `/api/blog/posts`, which does not exist. Unused — use the Redux thunks or Server Actions.
- `free-translate` in package.json is unused and unusable on a serverless host (Puppeteer). [app/actions/translate.ts](app/actions/translate.ts) replaces it.
- [components/NavigationWithI18n.tsx](components/NavigationWithI18n.tsx) is an unreferenced example; [components/Navigation.tsx](components/Navigation.tsx) is the one in use.
- [I18N_SETUP_GUIDE.md](I18N_SETUP_GUIDE.md) is a useful reference for the intended patterns, but its claim about browser-language detection describes behavior that is not implemented — the saved choice is restored from `localStorage` in [I18nProvider](components/I18nProvider.tsx), and there is no browser sniffing.

## Design guidance (from .bolt/prompt)

Pages should be production-quality and visually rich, not cookie-cutter. Stick to Tailwind + shadcn/ui + lucide-react; do not add new UI/icon/theme packages unless asked.
