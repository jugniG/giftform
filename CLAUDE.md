CODEBASE OVERVIEW

This is "driz", a full-stack web application built with TanStack Start (React SSR). The stack is TypeScript throughout. The project uses npm as the package manager. The working directory is the repo root.


TECH STACK

Framework: TanStack Start (built on Vite + React 19)
Router: TanStack Router (file-based, code-generated route tree at src/routeTree.gen.ts)
Server API: oRPC with Zod schema validation, exposed at /api/rpc/* (native protocol) and /api/* (OpenAPI)
Database ORM: Prisma with the native @prisma/adapter-pg adapter against PostgreSQL (Supabase)
Auth: better-auth with magic link and Google OAuth, Prisma adapter, tanstackStartCookies plugin
Email: Resend for transactional email (magic links)
UI components: HeroUI (@heroui/react) — this is the default component library for ALL UI work
Styling: Tailwind CSS v4 via @tailwindcss/vite (no config file, all in CSS)
Forms: react-hook-form with @hookform/resolvers/zod for Zod validation
Icons: react-icons — always use react-icons, never inline SVG for icons unless there is no suitable icon
Error monitoring: Sentry via @sentry/tanstackstart-react
State / data fetching: TanStack Query


IMPORT ALIASES

Both #/* and @/* resolve to ./src/*. Prefer #/ for all internal imports.

Examples:
  import { authClient } from '#/lib/auth-client'
  import { prisma } from '#/db'


PROJECT STRUCTURE

src/routes/          File-based routes. TanStack Router auto-generates src/routeTree.gen.ts — never edit that file manually. After adding or renaming route files run: npm run generate-routes

src/routes/__root.tsx          Root shell, sets up HTML document, loads global CSS, mounts devtools
src/routes/index.tsx           Public home page at /
src/routes/login.tsx           Auth page — magic link + Google OAuth
src/routes/_protected.tsx      Layout route for all authenticated pages, contains the navbar and auth guard
src/routes/_protected/         All pages that require authentication live here
src/routes/_protected/dashboard.tsx   Dashboard page at /dashboard
src/routes/api.$.ts            oRPC OpenAPI handler at /api/*
src/routes/api.rpc.$.ts        oRPC RPC handler at /api/rpc/*
src/routes/api/auth/$.ts       better-auth handler at /api/auth/*

src/lib/auth.ts                Server-side better-auth instance (magic link + Google OAuth + Prisma adapter)
src/lib/auth-client.ts         Client-side better-auth instance with magicLinkClient plugin

src/db.ts                      Prisma client singleton using globalThis pattern to survive hot reloads
src/env.ts                     Type-safe env vars via @t3-oss/env-core + Zod
src/router.tsx                 TanStack router factory, SSR query integration, Sentry error boundary
src/orpc/                      oRPC router definitions, client, and Zod schemas
src/integrations/              Third-party integration helpers (better-auth header component, TanStack Query provider)
src/styles.css                 Global styles — imports Tailwind, box-sizing reset, min-height on html/body/#app

prisma/schema.prisma           Database schema. Models: Todo, User, Session, Account, Verification


DATABASE MODELS

User: id (String), name, email (unique), emailVerified (Boolean), image?, createdAt, updatedAt, sessions[], accounts[]
Session: id, expiresAt, token (unique), ipAddress?, userAgent?, userId (FK)
Account: id, accountId, providerId, userId (FK), OAuth token fields, password?
Verification: id, identifier (indexed), value, expiresAt, createdAt, updatedAt
Todo: id (Int autoincrement), title, createdAt

All better-auth models are table-mapped to lowercase names (@@map).


AUTH FLOW

Server auth config lives in src/lib/auth.ts. The client-side instance is src/lib/auth-client.ts. The API handler is mounted at /api/auth/$ and delegates all requests to auth.handler(request).

Magic link: authClient.signIn.magicLink({ email, name, callbackURL }) — sends an email via Resend
Google OAuth: authClient.signIn.social({ provider: 'google', callbackURL })
Session check (client): authClient.useSession() — React hook, returns { data, isPending }
Session check (server / beforeLoad): authClient.getSession()
Sign out: authClient.signOut()

The _protected layout route guards all authenticated pages. It calls authClient.getSession() in beforeLoad and throws redirect({ to: '/login' }) if there is no session. It returns { user } from beforeLoad so every child route can access the current user via Route.useRouteContext():

  function DashboardPage() {
    const { user } = Route.useRouteContext()
    // user.id, user.name, user.email, user.image, etc.
  }

Do not call authClient.useSession() in protected pages — read user from context instead. This avoids a redundant client-side fetch.


ENV VARS

All env vars are validated at runtime through src/env.ts. Import env from '#/env' — never use process.env directly.

Server-side (accessed as env.X):
- DATABASE_URL            PostgreSQL connection string
- BETTER_AUTH_URL         Full URL of the app (e.g. http://localhost:3000)
- BETTER_AUTH_SECRET      Random secret, generate with: npx -y @better-auth/cli secret
- RESEND_API_KEY          Resend API key for sending magic link emails
- GOOGLE_CLIENT_ID        Google OAuth client ID (from Google Cloud Console)
- GOOGLE_CLIENT_SECRET    Google OAuth client secret
- SENTRY_AUTH_TOKEN       Sentry auth token for source maps upload
- NODE_ENV                development / production / test (auto-set)

Client-side (accessed as env.X, must be prefixed VITE_):
- VITE_SENTRY_DSN         Sentry DSN (client-side)

All env vars live in .env.local for local development.


UI AND COMPONENT RULES

Always use HeroUI (@heroui/react) components as the default for all UI. Do not build raw HTML equivalents of things HeroUI already covers. This includes but is not limited to: Button, Input, Card, CardHeader, CardBody, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, Navbar, NavbarBrand, NavbarContent, Divider, Spinner, Chip, Modal, Tooltip, Select, SelectItem.

When importing any UI component, follow this priority order:

1. Check src/components/ first. If a wrapper exists there, always import from #/components/ComponentName.
2. If no wrapper exists in src/components/, import directly from @heroui/react.
3. If HeroUI does not cover the use case, build a custom component in src/components/ and import from there.

Never import a component directly from @heroui/react if a wrapper for it already exists in src/components/.

Use Tailwind CSS v4 utility classes for layout, spacing, and any styling not covered by HeroUI props. Do not write custom CSS unless absolutely necessary.

For icons, always use react-icons. Never write inline SVG for standard icons. Pick from the ri (Remix Icons) set by default (e.g. RiDashboardLine, RiUserLine, RiLogoutBoxLine, RiSettingsLine). Use other react-icons sets only when a suitable icon does not exist in ri.

For forms, always use react-hook-form with zodResolver from @hookform/resolvers/zod. Define the Zod schema above the component, infer the TypeScript type from it, and pass the resolver to useForm. Display inline field errors using formState.errors. Never use uncontrolled forms or manual state for form values.


SENTRY INSTRUMENTATION

Wrap all createServerFn implementations with Sentry.startSpan:

  import * as Sentry from '@sentry/tanstackstart-react'

  Sentry.startSpan({ name: 'descriptive operation name' }, async () => {
    // server function body
  })

Error collection is automatic via the router configuration in src/router.tsx.


ROUTING CONVENTIONS

Route files use TanStack Router file-based conventions. Layout routes use a leading underscore (e.g. _protected.tsx) and are not path segments. Child routes of a layout go in a folder with the same name (e.g. _protected/dashboard.tsx resolves to /dashboard).

After creating, renaming, or deleting any route file, always run: npm run generate-routes

Never manually edit src/routeTree.gen.ts.

Use createFileRoute with the correct path string matching the file location. Use Outlet in layout routes to render children.

For navigation use useRouter().navigate({ to: '/path' }) or the Link component from @tanstack/react-router.


DATABASE CONVENTIONS

Use the Prisma client from src/db.ts (import { prisma } from '#/db').

After changing prisma/schema.prisma run: npm run db:generate (regenerates client) and npm run db:push (pushes schema to database without a migration file) or npm run db:migrate (creates a migration file).

The Prisma client outputs to src/generated/prisma. Do not edit generated files.


CODE STYLE

Language: TypeScript strict mode. No any unless unavoidable and commented. No unused variables or parameters (enforced by tsconfig).

Module system: ESM throughout (package.json "type": "module"). Use import/export, never require.

Quotes and formatting: follow the existing prettier config. Run npm run format before committing.

File naming: route files match the TanStack Router convention. Component files use PascalCase. Utility/lib files use camelCase.

Prefer named exports for components. Use default export only where TanStack Router or the integration pattern requires it (e.g. route files export Route as named, component as default function).

Keep Zod schemas at the top of the file, before the component. Infer TypeScript types from schemas, do not duplicate type definitions.
