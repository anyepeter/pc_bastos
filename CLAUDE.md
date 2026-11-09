# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bilingual (EN/FR) website for CEPCA/CPCC, a Cameroonian council of Protestant churches. Next.js 14 App Router, TypeScript, Tailwind + shadcn/ui, Prisma/PostgreSQL (Neon), self-hosted email + password auth, images in Cloudflare R2, Redux Toolkit + i18next for language state.

## Commands

```bash
npm run dev                  # dev server
npm run build                # prisma generate && next build
npm run lint                 # next lint (NOT run during build — see next.config.js)
npx tsc --noEmit             # typecheck (the only real "test" in this repo)
npx prisma generate          # regenerate the client (node_modules/.prisma/client)
npx prisma db push           # apply schema changes (there are no migrations)
npx prisma studio            # inspect the DB
npm run create-admin         # seed or reset a super admin (see Auth)
npm run seed-departments     # insert the eight council departments — missing slugs only
```

There is no test framework. Verification = `npx tsc --noEmit` + `npm run build`.

`npx prisma generate` must run before typechecking a fresh checkout (`postinstall` handles it after `npm install`). ESLint is skipped during builds, so lint errors will not fail CI — run `npm run lint` explicitly.

**Keep the standard `prisma-client-js` generator with no custom `output`, and import from `@prisma/client`.** A custom output folder (`lib/generated/prisma`, used until 2026-09-11) builds fine on Vercel but leaves the query engine out of the serverless functions: every request-time query then fails ("could not locate the Query Engine for runtime rhel-openssl-3.0.x"), the live login breaks, and ISR pages re-render empty while build-time pages still look fine. `binaryTargets` includes `rhel-openssl-3.0.x`, Vercel's runtime. The production project is `pc-bastos` in the `anyepeters-projects` Vercel team; it needs `DATABASE_URL`, `SESSION_SECRET`, `BREVO_API_KEY`, `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`.

**After `prisma db push` / `generate`, restart `next dev`.** A running dev server keeps the old Prisma client: new models are `undefined` on it, so new pages error and `getSiteSettings()` quietly serves its defaults. Never run `npm run build` in the same tree as a running `next dev` — they share `.next`; build a copy instead.

## Architecture

### Data: two very different sources

1. **Database-backed, editable in `/admin`** — `BlogPost`, `NewsArticle`, `Event`, `Announcement`, `Workshop`, `CharityProgram`, `Sermon`, `MemberChurch`, `Department`, `DepartmentActivity` and `BoardMember` in [prisma/schema.prisma](prisma/schema.prisma). A `DepartmentActivity` is an upcoming event, a report of work done, or a project, shown on its department's page; a department's key figures are one `value | label` per line, parsed in [lib/departments.ts](lib/departments.ts) (which otherwise only holds the public data shapes and the locale-file fallback used when the table is empty). `NewsArticle` (reported items: milestones, appointments, communiqués) is deliberately separate from `BlogPost` (reflection pieces); both sit under the News menu. Every translatable attribute is a **JSON column holding `{ en, fr }`**, not a column or row per locale.
2. **Still hardcoded** — the remaining home-page sections keep `const xData = [...]` arrays at the top of the component. Changing that content means editing the file.
3. **Site settings** — the council's logo, email, phone, WhatsApp numbers, address, opening hours, map link, social links and giving accounts. One `SiteSettings` row edited at `/admin/settings`; see [Site settings](#site-settings) below. None of these live in the locale files any more.

There are no migrations in `prisma/migrations`; the schema is applied with `npx prisma db push`.

### The generic admin resource layer

Everything except the blog is driven by field configs rather than hand-written forms. To add or change an attribute, edit the config — the editor, the admin list, validation and the publish rule all follow.

- [lib/admin/configs.ts](lib/admin/configs.ts) — field definitions per content type. This is the file you usually want.
- [lib/admin/resource-config.ts](lib/admin/resource-config.ts) — the `ResourceConfig` / `ResourceField` types and value narrowing helpers.
- [lib/admin/resource-service.ts](lib/admin/resource-service.ts) — isomorphic conversion + validation (`toFormValues`, `toPayload`, `findMissingField`), used by both the editor and the server.
- [lib/admin/resource-actions.ts](lib/admin/resource-actions.ts) — shared CRUD bound to a Prisma delegate, including slug de-duplication and R2 cleanup of orphaned images. A slug is the item's public address: it is built from the English title (accents kept as plain letters) **once, at creation**, and later edits never change it. The same rule holds for churches and department activities; departments and blog posts have an explicit slug field instead. A config's `alsoRevalidate` lists other public pages to refresh on save.
- Configs are passed from server pages into the client editor, so they must stay plain data — **no functions**. Extra checks are declared instead: a plain field with `format: 'link'` only accepts a site path or an `https://` address ([lib/safe-link.ts](lib/safe-link.ts)), and a `select` only accepts its own options; both run in `findFormatError`, in the editor and on the server.
- [components/admin/ResourceForm.tsx](components/admin/ResourceForm.tsx) / [ResourceTable.tsx](components/admin/ResourceTable.tsx) — the shared editor and list.
- `app/actions/<type>.ts` — thin `'use server'` wrappers binding a delegate + config to the shared CRUD. Server actions are passed straight into the client components as props.

The blog predates this layer and keeps its own [BlogPostForm](components/admin/BlogPostForm.tsx) / [BlogPostsTable](components/admin/BlogPostsTable.tsx); the behaviour is the same.

Public pages are server components that fetch published rows, serialise dates to ISO strings, and hand plain JSON to a client component which resolves text with `getTranslatedText(value, language)`. Date/time formatting lives in [lib/format.ts](lib/format.ts) and is locale-aware.

There are **no API routes** (`app/api/` does not exist). All server data flows through Server Actions in [app/actions/](app/actions/):
- [blog.ts](app/actions/blog.ts) — admin CRUD; enforces the publish rule below and calls `revalidatePath` on `/admin/blog` and `/blogs`.
- [blog-public.ts](app/actions/blog-public.ts) — published-only reads; casts the Prisma `Json` fields to `Translation`.
- [upload.ts](app/actions/upload.ts) — image upload to the R2 bucket (S3 API via [lib/r2.ts](lib/r2.ts)) under `church/<folder>/`, with a fresh key per upload (objects are cached as immutable, so never overwrite a key), and delete. The editor first shrinks photos in the browser ([lib/prepare-upload.ts](lib/prepare-upload.ts): 1600px, JPEG unless transparent); the action takes at most 4 MB and checks the file's magic bytes. `next.config.js` raises the server-action body limit from the 1 MB default to 4.5 MB, Vercel's ceiling. Replacing or deleting an image removes it from R2; `deleteImage` ignores every other host.
- [translate.ts](app/actions/translate.ts) — machine translation for the admin editor. Calls Google's public translate endpoint over `fetch`, splitting on paragraph breaks so markdown survives. Do **not** use the `free-translate` package for this — it drives Puppeteer, which cannot run in a serverless action.
- [contact.ts](app/actions/contact.ts) — the public contact form, and the project's only outgoing email. Delivers each message to the email in site settings through Brevo's transactional API over `fetch`, with the visitor as reply-to. Needs **`BREVO_API_KEY`** in every environment. The sender is fixed to `info@cepcacameroun.com` because Brevo refuses unverified senders (that one is verified, on an authenticated domain); the recipient can be any inbox. A honeypot field and an in-memory per-IP limit (5 per 10 minutes) protect the daily quota.
- [settings.ts](app/actions/settings.ts) — `getSiteSettings()` (public, cached under the `site-settings` tag, never throws) and `updateSiteSettings()` (super admin).

### Site settings

[lib/site-settings.ts](lib/site-settings.ts) holds the `SiteSettingsValues` type, `DEFAULT_SITE_SETTINGS` (what renders until `/admin/settings` is first saved) and the link helpers (`telHref`, `whatsappHref`, `mapEmbedSrc`, `logoSrc`, `socialLinks`, `givingDetailsMissing`). The root layout calls `getSiteSettings()` once and wraps the app in [SiteSettingsProvider](components/SiteSettingsProvider.tsx); client components read it with `useSiteSettings()`, server components call `getSiteSettings()` directly. Saving revalidates the tag and the whole layout.

- `getSiteSettings()` swallows database errors and returns the defaults, because every page renders through it — a missing table must not take the site down.
- Once saved, a blank optional field is **hidden**, not defaulted: no social link means no icon, no WhatsApp number means no floating button, no giving accounts means `/give` offers the office phone and email instead.
- The logo is limited to uploads (`isUploadedImage` in [lib/media.ts](lib/media.ts)) or `/images/…`: `next/image` renders it in the header and footer and only allows the hosts in `next.config.js`, so any other host would crash every page.
- Bank details are all-or-nothing (bank, account name, account number) — half an account sends a gift nowhere.

### Image storage (Cloudflare R2)

Uploads live in the R2 bucket `cepcacameroun`, served from the public `r2.dev` address in `MEDIA_BASE_URL`. Rows store full URLs. Until 2026-11-09 they lived on Cloudinary. That account (`daat4brij`) is **shared with other projects** (its `poppies/`, `testimonials/` and sample folders are not ours), so nothing here deletes from it any more. The council's 57 images were copied to the same paths in R2 and the database rewritten. Cloudinary URLs are still accepted for display, so rolling back is database-only. The backup, manifest and scripts are outside the repo, in `../cepca-backups/2026-11-09-r2-migration/`.

`r2.dev` addresses are rate-limited by Cloudflare and meant for development. Moving to a custom domain means changing `MEDIA_BASE_URL` and `next.config.js`, then rewriting the stored URLs.

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
- `/board` opens with the organogram, drawn from `BoardMember` rows edited at `/admin/board`. `office` picks the row (president → vice_president → member → general_secretary), `sortOrder` the place in it, and the departments always hang below the General Secretary. The page shows the chart and nothing else. The published General Secretary also heads `/about/general-secretariat`. Board photos go to R2 `church/board`. R2 has no transformations, so photos of people are cropped by CSS (`object-cover object-top`); upload head-and-shoulders shots. The migrated board and church-leader photos are face crops made by Cloudinary before the move (`*-face.jpg`). `boardAvatar`/`boardPortrait` in [lib/board.ts](lib/board.ts) only transform legacy Cloudinary URLs.
- A member church's `leaderPhoto` (optional, editable by the council and the church's own login) puts a face-cropped portrait beside the head's name on `/members/[slug]`; without one the name stays in the details list.
- Blog detail routes use `[id]` as the URL segment but the value is the **slug** — `generateStaticParams` maps `post.slug` into `id`.

### Auth and roles

Self-hosted email + password. Accounts are `User` rows; passwords are bcrypt hashes (cost 12, [lib/auth/password.ts](lib/auth/password.ts)). A login creates a `Session` row and sets a signed, `httpOnly`, `sameSite=lax` cookie holding only that row's id — signed with `jose` using **`SESSION_SECRET`**, which must be set in every environment. [lib/auth/session.ts](lib/auth/session.ts) exposes `getSession()` / `createSession()` / `destroySession()`; the login and logout actions live in [app/actions/auth.ts](app/actions/auth.ts) and the login page at [app/sign-in/page.tsx](app/sign-in/page.tsx).

[middleware.ts](middleware.ts) protects `/admin(.*)`. It only verifies the cookie's signature — the Edge runtime cannot reach the database — so it is a redirect convenience, not the authorisation check.

Three roles, defined in [lib/auth/roles.ts](lib/auth/roles.ts) and stored on the `User` row (each role's landing page and label are in [lib/auth/role-meta.ts](lib/auth/role-meta.ts)):

- **`super_admin`** — the council secretariat. Every content type, site settings, and church and department accounts.
- **`church`** — one member church. May edit only its own `MemberChurch` record, via `/admin/my-church`.
- **`department`** — one council department (`User.departmentId`). May edit only its own `Department` profile (not its slug, acronym, position or publish state) and its own activities, via `/admin/my-department`.

Only a row actually marked `super_admin` gets council access; an unrecognised role string is normalised to `church` (confined to one record), never upwards.

Enforced in three layers, and all three matter:

1. [app/admin/layout.tsx](app/admin/layout.tsx) resolves the role server-side and renders [AdminShell](app/admin/AdminShell.tsx) with role-specific navigation.
2. Every council page calls `requireSuperAdminPage()` (redirects a church or department account to its own workspace).
3. Every write action calls `requireSuperAdmin()` (throws) — centralised in [lib/admin/resource-actions.ts](lib/admin/resource-actions.ts) and [app/actions/blog.ts](app/actions/blog.ts). Church writes go through [app/actions/churches.ts](app/actions/churches.ts), where `resolveEditableChurchId` **discards any id sent by the browser** and substitutes the session's own `churchId`. Department writes do the same through `resolveEditableDepartmentId` in [app/actions/departments.ts](app/actions/departments.ts), and every activity read/write in [app/actions/department-activities.ts](app/actions/department-activities.ts) checks the activity belongs to the caller's department ("not yours" answers exactly like "not found").

`uploadImage`, `deleteImage` and the translate actions refuse unless some dashboard account is signed in — server actions are public URLs.

A church account is created from `/admin/churches/<id>/edit`, which writes a `User` row with role `church` and that church's id, and shows a generated temporary password **once**. Creating a church lands on that page (`afterCreate="edit"` on `ResourceForm`), and the `/admin/churches` list shows each church's login status. `User.churchId` has no foreign key, so `deleteChurch` deletes the church's logins itself — keep that if you touch it. Passwords are never emailed — the secretariat passes them on by hand (the contact form is the only outgoing mail). `/admin/account` lets any account change its own password; `resetChurchAccountPassword` issues a new temporary one and drops every open session.

Department logins are created the same way from `/admin/departments/<id>/edit` ("Department logins"), except the secretariat may type the password (min 10 characters) or leave it blank to generate one. `deleteDepartment` removes the department's logins itself (no foreign key); its activities cascade.

Seed or reset a super admin with `npm run create-admin` (`ADMIN_EMAIL` + `ADMIN_PASSWORD`, or two arguments). Credentials are never hardcoded.

**`SUPER_ADMIN_EMAILS`** (comma-separated) is a second lock: when set, even a row marked `super_admin` is refused unless its address is listed. Set it before launch.

## Conventions

- `'use client'` is required for anything using `useTranslation()`, Redux hooks, or React state. Server components pass translated text down as props.
- Server Actions return `{ success, data?, error? }` rather than throwing; callers check `result.success`.
- Path alias `@/*` maps to the repo root. shadcn/ui components in `components/ui/` are generated — prefer composing over editing them.
- Icons: `lucide-react`. Carousels: `swiper` and `embla-carousel-react`. Markdown: `react-markdown` + `remark-gfm`. Toasts: `sonner` (admin) / `hooks/use-toast.ts` (shadcn).
- Remote images are restricted in [next.config.js](next.config.js) to the R2 public address (`MEDIA_BASE_URL` in [lib/media.ts](lib/media.ts); keep the two in step) and `res.cloudinary.com`; add hosts there before using `next/image` with a new domain.

## Known dead/stale code

- [hooks/useBlogPosts.ts](hooks/useBlogPosts.ts) fetches `/api/blog/posts`, which does not exist. Unused — use the Redux thunks or Server Actions.
- `free-translate` in package.json is unused and unusable on a serverless host (Puppeteer). [app/actions/translate.ts](app/actions/translate.ts) replaces it.
- [I18N_SETUP_GUIDE.md](I18N_SETUP_GUIDE.md) is a useful reference for the intended patterns, but its claim about browser-language detection describes behavior that is not implemented — the saved choice is restored from `localStorage` in [I18nProvider](components/I18nProvider.tsx), and there is no browser sniffing.

## Design guidance (from .bolt/prompt)

Pages should be production-quality and visually rich, not cookie-cutter. Stick to Tailwind + shadcn/ui + lucide-react; do not add new UI/icon/theme packages unless asked.
