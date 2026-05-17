# Everything Agents — site

Source for [everythingagents.org](https://everythingagents.org). A
developer-toned tutorial site for building agents. Starts with
Agentforce; widens from there.

Built on Next.js 15 (App Router), Tailwind, shadcn primitives, and
Clerk for opt-in sign-up.

## Run locally

```
pnpm install
cp .env.example .env.local   # fill in your Clerk keys
pnpm dev
```

Open http://localhost:3000.

## Get Clerk keys

1. Create a free account at https://dashboard.clerk.com/
2. Create a new application (call it "Everything Agents" so the
   sign-up modal shows that name).
3. Copy the `Publishable key` and `Secret key` from the Clerk
   dashboard into `.env.local`.

The site renders without Clerk keys; the sign-up button just won't
open the modal.

## How content works

Tutorials live in `content/topics/<topic-slug>/`. Each topic folder
has a `meta.json` and a numbered set of `*.mdx` lesson files. The
MDX rendering pipeline lands in Phase 2.

The home page, topics index, and topic landing all read from
`lib/registry.ts`, the single source of truth for topic and lesson
metadata. Adding a new topic is one entry there until the MDX
pipeline replaces it with file-system discovery.

## Deploy to Vercel

```
pnpm dlx vercel link        # first time only
pnpm dlx vercel --prod      # deploy
```

Domain configuration: point `everythingagents.org` (and the `www`
subdomain) at the Vercel project. Vercel issues TLS certificates
automatically once DNS resolves.

Required environment variables in Vercel:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Why opt-in sign-up

Sign-up exists so we can email readers when a new tutorial lands.
Content is never gated. There are no drip campaigns.

## Where the design lives

`DESIGN.md` documents the typography, color tokens, layout, and
brand mark.

## Adding content

See `CONTRIBUTING.md` for a step-by-step guide to adding topics,
lessons, illustrations, and knowledge checks. The site is content-
first and most additions are MDX, not code.
