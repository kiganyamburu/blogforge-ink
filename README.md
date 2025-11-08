# blogforge-ink

A modern, lightweight blogging frontend built with Vite, React, TypeScript, Tailwind CSS and Supabase for backend services. This repository provides the UI and client-side integrations used to create, edit and publish content.

## Quick overview

- Framework: Vite + React (TypeScript)
- Styling: Tailwind CSS (with shadcn/ui-style components)
- Backend: Supabase (for auth and database)
- State & data: React Query (@tanstack/react-query)
- Rich text / Markdown: react-markdown

This project is intended as the frontend for a blog/CMS experience — editor, post listing, post detail, and a protected dashboard.

## Features

- Authenticated editor and dashboard (Supabase)
- Markdown editor and preview
- Reusable UI primitives (radix-ui + shadcn-style components)
- Tailwind-powered responsive design and theme toggle
- Client-side routing with React Router

## Getting started

Prerequisites

- Node.js (recommended) or Bun
- npm, pnpm or yarn

Clone the repo:

```powershell
git clone https://github.com/kiganyamburu/blogforge-ink.git
cd blogforge-ink
```

Install dependencies (npm example):

```powershell
npm install
```

Run the dev server:

```powershell
npm run dev
```

Open http://localhost:5173 (or the port printed by Vite) in your browser.

## Environment variables

Create a `.env` (or `.env.local`) in the project root with the following values for Supabase:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Notes:

- The client that talks to Supabase is in `src/integrations/supabase/client.ts`. Check `supabase/` for local migrations used for the database schema.

## Available scripts

Scripts are defined in `package.json`. Common commands:

- Start dev server

```powershell
npm run dev
```

- Build production bundle

```powershell
npm run build
```

- Build (development-mode build)

```powershell
npm run build:dev
```

- Preview production build locally

```powershell
npm run preview
```

- Run ESLint

```powershell
npm run lint
```

If you're using Bun, you can use `bun install` and `bun run dev` where appropriate, but the repo ship scripts expect a Node/npm-compatible runner.

## Project structure (high level)

- `src/`

  - `components/` - UI components and shadcn-style primitives
  - `hooks/` - custom React hooks
  - `integrations/supabase/` - Supabase client and types
  - `pages/` - route pages (Index, Post, Editor, Dashboard, Auth, etc.)
  - `lib/` - small utilities

- `public/` - static assets
- `supabase/` - migrations and local Supabase config

## Contributing

Contributions are welcome. A simple workflow:

1. Fork the repository
2. Create a topic branch: `git checkout -b feat/your-feature`
3. Make changes and add tests where appropriate
4. Run lint and the dev server to verify behavior
5. Open a PR with a clear description of the change

Please keep changes small and focused. If you plan a large refactor, open an issue first to discuss.

## Notes & next steps

- Add unit and integration tests (Jest/Testing Library or Vitest)
- Add CI (GitHub Actions) for linting and build checks
- Add a demo deployment (Vercel, Netlify, or Supabase Hosting)

## License

This project is provided under the MIT License. See the `LICENSE` file for details.

---

If you want the README shortened, expanded with screenshots, or tailored for a README on npm/marketplace pages, tell me which sections to focus on and I’ll update it.
