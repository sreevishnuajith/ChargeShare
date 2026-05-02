# ChargeShare — Process Diary

**Project:** ChargeShare — EV Charging Booking and Management System  
**Student:** Vishnu  
**Assessment:** Year 12 Enterprise Computing — Assessment Task 3 (30%)  
**Due Date:** Monday 25 May 2026  

---

## Overview

This diary records the development progress of ChargeShare, an enterprise system that allows residents in shared apartment buildings to book EV charging slots, track energy usage, and receive automated billing. It is maintained as part of Component A (Project Documentation) and covers all four stages: Identifying and Defining, Research and Planning, Producing and Implementing, and Testing and Evaluating.

---

## Phase 1 — Tasks 1–4: Foundation (18 April – 1 May 2026)

### Saturday 18 April 2026

**Task 1 — Define problem and requirements (Day 1/4)**

Started the project today. Spent time brainstorming ideas for the enterprise system. Came up with three possible ideas:
1. A room booking system for a school or community centre
2. A shared EV charging management platform for apartments
3. A staff rostering tool for a small business

After thinking through each one, I decided to go with the EV charging system. EV adoption in NSW is genuinely growing fast and I could see the problem is real — there are apartments in my area with only one or two shared power points. It felt like a meaningful problem to solve.

**Key decisions made:**
- Project name: ChargeShare
- Core problem: booking conflicts, unfair cost allocation, no data for managers
- Initial system idea: booking system + billing + admin dashboard

**Reflection:** Starting the brainstorming process was harder than expected. I initially thought the room booking system would be easier, but the EV charging problem felt more original and had more interesting technical challenges (like the fairness angle and billing calculation).

---

### Sunday 19 April 2026

**Task 1 — Define problem and requirements (Day 2/4)**

Continued working on the problem definition. Did some research into EV charging infrastructure challenges in NSW strata and apartment buildings. Found that "ICE-ing" (when non-EV vehicles block charging spots) and cost allocation disputes are common complaints in strata forums.

Drafted the initial problem statement, functional requirements, and non-functional requirements:
- Functional: user authentication, charger booking, session tracking, billing, admin dashboard, email notifications
- Non-functional: JWT security, responsive UI, relational database, modular codebase

Also started writing the system scope — decided that the prototype would simulate charging (not use real hardware) and store data locally using SQLite rather than deploying to the cloud.

**Output:** First draft of Section 1.1 (Problem Definition and System Requirements) in the Component A document.

---

### Monday 20 April 2026

**Task 1 — Define problem and requirements (Day 3/4)**

Defined the success criteria for the project. The system should be considered successful if it can:
- Prevent double-booking of chargers
- Accurately calculate cost from simulated kWh usage
- Generate monthly invoices per user
- Provide admin dashboard visualisations
- Send automated development email notifications

Also wrote about how requirements were determined — through research into real-world strata problems, thinking through resident and admin perspectives, and scope management to keep the project achievable.

**Reflection:** Defining success criteria upfront was helpful. It gives me a checklist to test against later. The hardest part was keeping the scope realistic — I initially wanted to add real payment processing, but that would have been too complex for the timeframe.

---

### Tuesday 21 April 2026

**Task 1 — Define problem and requirements (Day 4/4)**

Completed the tools and resources section. Created the development tools table listing:
- VS Code (IDE)
- React + Vite + Tailwind CSS (frontend)
- Node.js + Express + Prisma (backend)
- SQLite (database)
- node-cron (scheduler)
- Mailpit + Nodemailer (email)
- JWT + bcrypt (authentication)
- Pino (logging)
- Chart.js (visualisations)

Also wrote the justification for each tool choice — React for interactive UI, Node.js for fast backend, SQLite for simplicity, Prisma for type-safe database access.

**Output:** Completed Section 1.2 (Justify Tools and Resources). Task 1 finished on schedule.

---

### Wednesday 22 April 2026

**Task 2 — Design system models (Day 1/4)**

Started the systems modelling work today. Began with the high-level system architecture — ChargeShare follows a three-tier architecture:
1. Presentation layer (React frontend)
2. Application layer (Node.js + Express backend)
3. Data layer (SQLite via Prisma ORM)

Also started outlining the Data Flow Diagram (DFD). Identified the four external entities: Residents, Building Administrators, Simulated Charger System, and Email System.

**Reflection:** Three-tier architecture was a good framework to think about the system. It helped me understand why keeping the frontend, backend, and database separate is important — it makes it easier to maintain and scale each layer independently.

---

### Thursday 23 April 2026

**Task 2 — Design system models (Day 2/4)**

Worked on the Level 0 and Level 1 DFDs today.

Level 0 (Context Diagram): Shows the ChargeShare system as a single process, with data flows to and from Residents, Administrators, the Simulated Charger, and the Email System.

Level 1 (Detailed Processes): Broke the system down into five key processes:
1. Authenticate Users
2. Manage Bookings
3. Track Charging Sessions
4. Calculate Billing
5. Send Notifications

Each process connects to the appropriate data stores (Users, Bookings, Sessions, Invoices).

**Output:** DFD Level 0 and Level 1 diagrams documented in Component A.

---

### Friday 25 April 2026

**Task 2 — Design system models (Day 3/4)**

Spent today on the Entity Relationship Diagram (ERD) and booking decision logic. Modelled six entities:
- Building
- User
- Charger
- Booking
- Session
- Invoice

Key relationships:
- A building has many users and chargers
- A user makes many bookings
- A booking is linked to one charger
- A booking produces at most one session
- A user receives many invoices

Used crow's-foot notation to represent cardinality. This ERD will become the direct blueprint for the Prisma schema.

Also documented the booking decision logic (process model):
- Reject if user not authenticated
- Reject if charger unavailable
- Reject if time slot overlaps existing booking
- Otherwise accept and confirm

**Reflection:** Building the ERD before writing any code was really useful. I realised I needed an Invoice model that links to User rather than Booking — otherwise it would be hard to aggregate monthly charges.

---

### Saturday 26 April 2026

**Task 2 / Task 3 — System models completed + Environment setup begins**

Completed Task 2 today. Finished and documented the system architecture overview, DFD, ERD, and booking process model in the Component A document. Also completed the Research and Planning section (Section 2), including:
- Role of online collaboration tools (GitHub, Figma, GitHub Actions)
- Project schedule (Gantt chart overview — 30-day plan)
- Budget (all tools free/open-source, total $0–15)
- Collaboration and management considerations

Then immediately moved into Task 3 — setting up the development environment.

**Environment assessment completed:**
- Node.js v25.4.0 installed (project targets Node 22 LTS)
- npm 11.7.0 ready
- Git 2.50.1 installed
- Mailpit 1.29.7 installed for email testing
- VS Code with recommended extensions configured

Created the monorepo workspace structure:
- `apps/frontend` — React + Vite + Tailwind CSS
- `apps/backend` — Express + Prisma + JWT stack

**Output:** `docs/environment-assessment.md` created. Workspace structure initialised.

---

### Sunday 27 April 2026

**Task 3 — Set up development environment (Day 2/3)**

Configured the project toolchain:
- Set up ESLint and Prettier for code quality across both workspaces
- Added `.editorconfig` for consistent formatting
- Set up `.nvmrc` to pin Node version
- Configured frontend with Vite, Tailwind CSS, and PostCSS
- Set up backend with Express, Helmet (security headers), CORS, and Pino logging
- Added VS Code extension recommendations for the project

Created the initial `App.jsx` placeholder for the frontend — a simple splash page listing the six planned build phases. This confirms the frontend stack works end-to-end.

Also set up the Figma wireframes for the main screens:
- Login / Register screen
- Resident Dashboard
- Book Charger screen
- My Sessions page
- My Invoices page
- Admin Dashboard

**Output:** `docs/wireframes.md` and `docs/wireframes.html` created. Frontend and backend scaffolds confirmed working.

---

### Tuesday 28 April 2026

**Task 3 — Set up development environment (Day 3/3)**

Final day of environment setup. Focused on:
- Adding Vitest and Testing Library to the frontend workspace
- Adding Vitest and node-mocks-http to the backend workspace
- Writing initial smoke tests to verify the test runners work
- Documenting the full solution design in `docs/solution-design.md`

The solution design document covers the full API surface, data model overview, high-level architecture, risks, and implementation phases. This will serve as the ongoing reference document during development.

**Confirmed working:**
- `npm run dev` starts the frontend Vite dev server
- `npm run dev` starts the backend Express server
- Both test runners pass their initial smoke tests

**Reflection:** Taking the time to document the solution design now means I have a clear plan for each phase. Without this, I'd probably just start coding and get confused about how everything fits together.

---

### Wednesday 29 April 2026

**Task 4 — Build database and authentication system (Day 1/3)**

Started Task 4 — the database and authentication layer. Wrote the full Prisma schema (`apps/backend/prisma/schema.prisma`) based directly on the ERD designed earlier.

Models defined:
- `Building` — id, name, address, createdAt
- `User` — id, fullName, email (unique), passwordHash, role (ADMIN/RESIDENT), buildingId
- `Charger` — id, label, location, powerKw, isActive, buildingId
- `Booking` — id, userId, chargerId, startAt, endAt, status (CONFIRMED/CANCELLED/COMPLETED)
- `Session` — id, bookingId (unique), startedAt, endedAt, energyKwh, costAud
- `Invoice` — id, userId, periodStart, periodEnd, totalAud, status (DRAFT/SENT/PAID)

Added a composite index on `Booking(chargerId, startAt, endAt)` to support fast availability checks.

Also created a comprehensive database specification document covering the full schema, relationships, seed data plan, and local setup workflow.

**Output:** `apps/backend/prisma/schema.prisma` committed. `docs/database-spec.md` created.

---

### Thursday 30 April 2026

**Task 4 — Build database and authentication system (Day 2/3)**

Ran Prisma migration to generate the SQLite database from the schema:

```bash
npx prisma migrate dev --name init
```

Migration ran successfully. Created `apps/backend/prisma/dev.db`.

Then planned the seed data:
- 1 demo building (ChargeShare Demo Building, 100 Example St, Sydney NSW)
- 1 admin user
- 3 resident users (vishnu@chargeshare.local, resident2@, resident3@)
- 3 chargers (A1 7.2kW, A2 7.2kW, B1 11kW)

Used Prisma Studio to verify the tables were created correctly and all fields were present.

**Reflection:** The migration workflow with Prisma is very clean. It generates SQL automatically from the schema, which means I don't have to write raw SQL to create tables. The `@@index` on Booking helped me understand how performance can be improved for specific queries.

---

### Friday 1 May 2026

**Task 4 — Build database and authentication system (Day 3/3)**

Completed the foundational backend setup. Added the full Express application skeleton:
- Security middleware: `helmet` for HTTP headers, `cors` for cross-origin requests
- JSON body parser
- Structured logging with `pino-http`
- `/health` endpoint returning system status

Verified the server starts correctly with `npm run dev`. The health check confirms the API is running:

```json
{ "status": "ok", "app": "ChargeShare API", "timestamp": "..." }
```

Also committed the first meaningful GitHub push to the remote repository at `github.com/sreevishnuajith/ChargeShare`. The initial commit includes the full environment setup, wireframes, architecture docs, database spec, Prisma schema, and app scaffolds.

**Tasks 1–4 status: COMPLETE** ✓

| Task | Description | Duration | Status |
|------|-------------|----------|--------|
| 1 | Define problem and requirements | 4 days | ✅ Done |
| 2 | Design system models (DFD, ERD, wireframes) | 4 days | ✅ Done |
| 3 | Set up development environment | 3 days | ✅ Done |
| 4 | Build database and authentication system | 3 days | ✅ Done |

**Reflection:** Reaching the end of Phase 1 feels like a good milestone. The foundation is solid — the database schema matches the ERD, the backend scaffold is clean and extensible, and the frontend placeholder confirms the React + Vite stack is working. The next phase moves into active feature development.

---

## Phase 2 — Tasks 5–6: Booking System and Charging Simulation (2–3 May 2026)

### Saturday 2 May 2026

**Task 5 — Develop booking system (Day 1/2)**

> *(In progress — diary entry to be written at end of day)*

**Planned work:**
- Implement `POST /auth/register` and `POST /auth/login` endpoints (JWT + bcrypt)
- Add JWT authentication middleware to protect routes
- Implement `GET /chargers` endpoint with availability status
- Implement `POST /bookings` with full overlap detection logic
- Implement `GET /bookings/me` for residents to view their bookings
- Wire up database seed script with test users and chargers
- Begin frontend: Login page and Registration form

---

### Sunday 3 May 2026

**Task 6 — Implement charging simulation (Day 1/2)**

> *(Planned — diary entry to be written at end of day)*

**Planned work:**
- Implement `node-cron` scheduler for session simulation
- Write session simulation logic: when a booking's `startAt` arrives, create a Session record and begin incrementing `energyKwh` at a rate proportional to the charger's `powerKw`
- When booking's `endAt` arrives, finalise the session: set `endedAt`, calculate `costAud = energyKwh * tariff`
- Implement `GET /sessions/me` endpoint
- Continue frontend: Resident Dashboard showing active and upcoming bookings
- Book Charger screen with date/time picker and charger selection

---

## Upcoming Tasks

| Task | Description | Planned Dates |
|------|-------------|---------------|
| 5 | Develop booking system | 2–3 May |
| 6 | Implement charging simulation | 2–3 May |
| 7 | Develop billing and invoicing | TBD |
| 8 | Build admin dashboard and charts | TBD |
| 9 | Implement notifications | TBD |
| 10 | Testing and user feedback | TBD |
| 11 | Documentation and process diary | Ongoing |
| 12 | Presentation preparation | TBD |
| 13 | Final review and submission | By 25 May |

---

## Key Design Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 18 Apr | Selected EV charging as the project problem | Original problem, real-world relevance, interesting technical challenges |
| 19 Apr | Scoped out real hardware integration | Too complex for prototype; simulated charging achieves same educational goals |
| 21 Apr | Selected SQLite over PostgreSQL for prototype | Zero server setup, easy to reset, suitable for school demo environment |
| 23 Apr | Used Prisma ORM over raw SQL | Type-safe queries, automatic migration, prevents SQL injection by default |
| 25 Apr | Invoice links to User, not Booking | Enables monthly aggregation across multiple sessions per user |
| 27 Apr | Three-tier architecture | Separation of concerns, reflects industry practice, easier to maintain |
| 29 Apr | Added composite index on Booking(chargerId, startAt, endAt) | Required for efficient overlap detection queries |

---

## Issues and Resolutions Log

| Date | Issue | Resolution |
|------|-------|------------|
| 26 Apr | Node.js v25 installed but project targets v22 LTS | Added `.nvmrc` pinning Node 22; documented in environment assessment |
| 28 Apr | Initial test runner setup needed separate config for frontend vs backend | Created separate `vitest.config.js` in each workspace |
| 1 May | First GitHub push required SSH key configuration | Configured SSH key on macOS and verified push to `github.com/sreevishnuajith/ChargeShare` |
