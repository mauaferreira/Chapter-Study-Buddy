# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### english-quest (`/`)
A colorful, kid-friendly English learning web app for an 8-year-old, covering Unit 3 — "Where we live". Built on the react-vite scaffold (port 18289).

- **UI language**: English with Portuguese (BR) helper hints
- **Audio**: Native browser SpeechSynthesis (Web Speech API), `useSpeak` hook picks the best available en-US/en-GB voice
- **Curriculum** (`src/lib/curriculum.ts`): 20 vocab items (rooms + furniture), 7 prepositions of place, 8 preposition scenes, 10 Does/Doesn't yes-no questions, randomized quiz builder
- **Activities**: Flashcards, Quiz, Unscramble (audio + image + click letters with HINT/SLOW), Listen & Match (4-image grid), Where is it? (picture-prepositions), Does or Doesn't? (yes/no)
- **Components**: `AppShell` (header + back-to-home), `SpeakerButton`, `PrepositionScene` (composes scenes from furniture images + lucide icons because image generation hit free-tier limit), `Confetti`, `CelebrationScreen` (1-3 stars)
- **Progress**: localStorage-backed star tracking per activity (`src/lib/progress.ts`); Home shows total stars and per-activity stars
- **Look & feel**: Cream background, 5 activity colors (sun/sky/leaf/coral/grape), Fredoka display + Nunito body, large 1.25rem radius, framer-motion bouncy animations
