# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run lint        # ESLint (flat config, eslint.config.js)
npm run typecheck   # tsc -b (project references, noEmit — type errors only)
npm run build       # tsc -b && vite build
npm run preview     # preview a production build locally
```

There is no test runner configured in this project.

CI (`.github/workflows/ci.yml`) runs `lint`, `typecheck`, and `build` (in that dependency order) on every push/PR to `master`. `node-version-file: package.json` reads the `engines.node` field, so keep that field and your local Node version in sync.

## Environment

The backend API base URL is read from `VITE_API_URL` (see `src/vite-env.d.ts` for the typing). Copy `.env.example` to `.env.local` for local development — it currently points at `http://localhost:8000`, matching the backend's local dev port. `.env*` files are gitignored except `.env.example`.

## Architecture

This is a single-page Vite + React 19 + TypeScript app, currently very early-stage: essentially all application logic lives in `src/App.tsx`. There is no router, no component library, and no shared API/service layer yet — `fetch` calls are made inline within event handlers in `App.tsx`.

- `src/App.tsx` — auth (register/login) and user-profile forms, both talking directly to the backend via `fetch` against `${VITE_API_URL}/user/...` endpoints. Auth uses `localStorage` (`token`, `username`) for session state — there is no auth context/provider yet, components read `localStorage` directly.
- `src/styles/styles.css` — a standalone design system stylesheet (color variables, typography, buttons, cards, recipe detail layout, fridge/ingredient-manager styles, ratings/comments) for a planned "Boulangerie" French-cookbook themed UI. **Not currently imported anywhere** — `src/App.tsx` still uses inline `style={{...}}` objects and imports `src/styles/App.css`/`src/index.css` instead. When building new UI, prefer wiring up `styles.css` (or migrating its classes) rather than continuing the inline-style pattern.
- `src/components/` — present but currently empty; intended location for extracted components as `App.tsx` is broken up.

Given the stylesheet's naming (recipe headers, ingredient lists, instruction steps, a "fridge" ingredient manager, ratings/comments, favorites), expect the backend/product direction to be a recipe-management app with a personal ingredient inventory ("fridge") feature.

## Linear / PR workflow

Branches are named with a Linear issue key, e.g. `JKR-41`. `.github/workflows/sync_linear_pr.yml` runs on every push to a non-`master` branch: it extracts the issue key from the branch name via regex (`[A-Za-z]+-[0-9]+`), opens a draft PR into `master` if one doesn't exist yet (via `gh pr create`), and calls `.github/scripts/sync_linear.py` to comment on the Linear issue with the commit/PR link and move the issue to its "In Review" state the first time a PR is opened. For this automation to fire, branch names must contain the Linear issue key.
