# Environment Assessment (Phase 1)

Assessment date: 26 April 2026

## Current Local Tooling

| Tool    | Version | Status    | Notes                                         |
| ------- | ------- | --------- | --------------------------------------------- |
| Node.js | v25.4.0 | Installed | Project will target Node 22 LTS for stability |
| npm     | 11.7.0  | Installed | Suitable for workspaces                       |
| Python  | 3.9.6   | Installed | Useful for utility scripts                    |
| Git     | 2.50.1  | Installed | Ready for version control                     |
| ripgrep | 15.1.0  | Installed | Fast code search                              |
| Mailpit | 1.29.7  | Installed | Local email capture for notification testing  |

## Project Toolchain Established

- Monorepo workspace structure (`apps/frontend`, `apps/backend`)
- Frontend tooling: React, Vite, Tailwind CSS
- Backend tooling: Express, Prisma, SQLite, JWT stack, Pino logging
- Testing tooling:
  - Frontend: Vitest + Testing Library
  - Backend: Vitest + node-mocks-http
- Code quality tooling: ESLint + Prettier
- VS Code extension recommendations added in `.vscode/extensions.json`

## Recommended Runtime Baseline

- Use Node 22 LTS for predictable package compatibility (`.nvmrc` included)
- Mailpit is installed and ready for SMTP/UI local testing
- Use `.env` from `apps/backend/.env.example` for local development

## Open Items

- Configure GitHub authentication for first push from this machine
