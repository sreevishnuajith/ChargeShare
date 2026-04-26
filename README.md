# ChargeShare

ChargeShare is a Year 12 Enterprise Computing project focused on fair and efficient management of shared EV chargers in apartments/workplaces.

## Workspace Structure

- `apps/frontend`: React + Vite + Tailwind UI
- `apps/backend`: Express + Prisma + SQLite API
- `docs`: Requirements, design, and wireframes

## Quick Start

1. Install Node.js 22 LTS (`nvm use`, based on `.nvmrc`)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate --workspace apps/backend
   ```
5. Run dev servers:
   ```bash
   npm run dev
   ```

## Core Docs

- `docs/environment-assessment.md`
- `docs/solution-design.md`
- `docs/database-spec.md`
- `docs/wireframes.md`
- `docs/wireframes.html`
