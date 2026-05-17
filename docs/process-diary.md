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

**Task 5 — Develop booking system (COMPLETE)**

Built the full user login system and booking system today.

**Login and registration:**
- Built the Register and Login pages with form validation and clear error messages
- User passwords are stored securely — they are never saved as plain text
- When a user logs in successfully, the system issues them a secure token that keeps them logged in across pages
- Pages that require a login automatically redirect unauthenticated visitors back to the login screen

**Charger listing and bookings:**
- Built the charger listing page showing all chargers in the building and whether each one is currently available
- Built the booking system with double-booking prevention — if a resident tries to book a time slot that someone else has already claimed, the system rejects it with a clear message
- Residents can view all their own bookings and cancel upcoming ones

**Demo data:**
- Set up the demo database with one admin account, three resident accounts, and three chargers so the system can be demonstrated without needing real users

**Testing done today:**
- Registered a new resident account and confirmed it was saved correctly
- Logged in with the new account and confirmed the dashboard was accessible
- Tried to book the same time slot twice — confirmed the second attempt was rejected as expected
- Tried to access the dashboard without logging in — confirmed it redirected to the login page
- Verified that cancelling a booking updated its status correctly

---

### Sunday 3 May 2026

**Task 6 — Implement charging simulation (COMPLETE)**

Completed the charging simulation and the remaining frontend screens today.

**Charging simulation:**
- Built an automated background process that monitors bookings. When a booking's start time arrives, it automatically begins a charging session for that reservation
- While the session is running, the system tracks how much energy has been used based on how long the car has been charging and how fast the charger delivers power
- When the booking's end time arrives, the session is automatically finalised — total energy used and the cost are calculated and saved. The cost is calculated at 35 cents per kilowatt-hour
- Residents can view all their past sessions on the My Sessions page, which shows the date, duration, energy used, and total cost for each charge

**Remaining frontend screens:**
- Dashboard — shows the resident's upcoming and currently active bookings
- Book Charger — date and time picker with charger selection; shows an error if the chosen slot is already taken
- My Bookings — full list of all bookings for the logged-in resident with status labels
- Wired all screens together so navigation works end-to-end

**Testing done today:**
- Created a test booking with a start time two minutes in the past, then confirmed the simulation automatically detected and started the session
- Verified the energy amount was calculated correctly based on charger speed and session duration
- Verified the cost calculated correctly at 35 cents per kilowatt-hour
- Confirmed completed sessions appeared on the My Sessions page with the right figures
- Tested the Book Charger screen with a date/time conflict and confirmed the error message appeared

**Phase 2 complete. Tasks 5 and 6 are both done.**

---

## Phase 3 — Task 10: Testing (9–10 May 2026)

### Saturday 9 May 2026

**Task 10 — Testing and user feedback (Day 1/2)**

Started the formal testing phase today, working through the test plan document systematically.

**What was tested:**
- Health check — confirmed the application loads and the server responds correctly
- Registration flow — tested valid registration, duplicate email rejection, and missing field validation
- Login flow — tested correct credentials, wrong password, and non-existent account
- Charger listing — confirmed chargers display with correct availability status
- Booking creation — tested a valid booking, a double-booking conflict, and a booking outside valid hours
- Booking cancellation — confirmed a resident can cancel their own booking but not another resident's

All test cases above passed. Results recorded in the test plan document with observations noted for each case.

**Reflection:** Running through each test case one at a time revealed a couple of edge cases I hadn't thought about during development. The process of writing down exact steps and expected results before testing made it much easier to notice when something wasn't quite right.

---

### Sunday 10 May 2026

**Task 10 — Testing and user feedback (Day 2/2)**

Continued and completed the main round of testing today.

**What was tested:**
- Charging simulation — observed a session start and end automatically, verified energy and cost figures
- My Sessions page — confirmed completed sessions display with correct duration, energy, and cost
- My Bookings page — verified all booking statuses display correctly
- Dashboard — confirmed upcoming and active bookings display for the logged-in resident
- Authentication protection — confirmed all resident pages redirect to login when accessed without a session

**Test plan updates:**
- Rewrote all test cases in plain step-by-step language so they are easier to follow during demonstration
- Removed one test case (AUTH-08) that was redundant with an existing case
- Updated the actual results column across all completed test cases

**Reflection:** Testing took longer than expected because I wanted to be thorough rather than just clicking through quickly. Writing the actual results down as I went was useful — it means the test plan is now a record of what the system actually does, not just what I planned for it to do.

---

## Phase 4 — Tasks 7–9: Billing, Admin Dashboard, and Notifications (16 May 2026)

### Saturday 16 May 2026

**Task 7 — Develop billing and invoicing (COMPLETE)**

Built the full invoice system today, both on the backend and the frontend.

**Backend — invoice routes (`apps/backend/src/routes/invoices.js`):**
- `GET /invoices/me` — returns all invoices for the logged-in resident, ordered by period start date
- `POST /invoices/generate` — admin-only endpoint that accepts a date range, finds all completed sessions in that period, aggregates the total cost per resident, and creates one invoice per resident in a single database transaction
- `PUT /invoices/:id/status` — admin-only endpoint to mark an invoice as DRAFT, SENT, or PAID
- `GET /invoices/` — admin-only list of all invoices across all residents

The invoice generation logic first queries all completed sessions whose end time falls within the billing period, groups them by user, calculates the total cost for each user, and inserts the invoices in one atomic transaction. If no sessions exist for the period, the endpoint returns immediately with zero created invoices.

**Frontend — My Invoices page (`apps/frontend/src/pages/InvoicesPage.jsx`):**
- Lists all invoices for the logged-in resident
- Each invoice card shows the invoice number, billing period, issue date, total amount, and current status
- Status is displayed as a colour-coded badge: grey for DRAFT, amber for SENT, teal for PAID
- Empty state message shown if no invoices have been generated yet

**Wiring:**
- `GET /invoices/me` mounted on the resident protected route
- Invoices link added to the navigation bar for resident users
- Dashboard card updated from "Coming soon" to a live link to `/invoices`

---

**Task 8 — Build admin dashboard and charts (COMPLETE)**

Built the full admin dashboard today with summary statistics and three Chart.js visualisations.

**Backend — admin routes (`apps/backend/src/routes/admin.js`):**
- `GET /admin/dashboard` — returns:
  - Summary stats: total resident count, total bookings, completed sessions, total energy delivered (kWh), total revenue (AUD)
  - Daily stats for the last 14 days: sessions per day, revenue per day, energy per day — used to power the charts
  - Charger utilisation: count of completed sessions per charger
- `GET /admin/users` — full list of resident accounts with booking and invoice counts
- `GET /admin/sessions` — all sessions with user and charger details

All admin routes are protected by an inline middleware that checks the user's role from the JWT. Non-admins receive a 403 response.

**Frontend — Admin Dashboard page (`apps/frontend/src/pages/AdminDashboardPage.jsx`):**
- Summary stat cards at the top: Residents, Bookings, Sessions, Total Energy, Total Revenue
- Three Chart.js visualisations:
  1. Bar chart — sessions per day over the last 14 days (teal bars)
  2. Line chart — revenue per day in AUD over the last 14 days (filled area chart)
  3. Bar chart — charger utilisation: completed sessions per charger (indigo bars)
- Invoice management panel: date range pickers to select a billing period and a button to generate invoices; success/error feedback shown inline
- Invoices table: all invoices with a status dropdown per row so the admin can update DRAFT → SENT → PAID without leaving the page
- Residents table: shows each resident's name, email, booking count, and invoice count

**Access control:**
- Added `AdminRoute` component (`apps/frontend/src/components/AdminRoute.jsx`) — redirects non-admins to the dashboard, redirects unauthenticated users to login
- Admin users see a simplified navbar with only "Admin Dashboard"; the resident nav links are hidden for admin accounts
- Admin users see a different dashboard card set: "Admin Dashboard" and "Manage Invoices" instead of the resident feature cards

---

**Task 9 — Implement notifications (COMPLETE)**

Built the email notification system using Nodemailer connected to Mailpit for local development testing.

**Mailer module (`apps/backend/src/mailer.js`):**
- Nodemailer transport configured for SMTP on localhost:1025 with TLS disabled — this connects directly to Mailpit, which intercepts all outbound emails without delivering them externally
- Three notification functions:
  1. `sendBookingConfirmation(user, booking, charger)` — sent when a resident creates a booking; includes charger details, start/end time, and reminder to connect the vehicle before start time
  2. `sendSessionSummary(user, session, booking, charger)` — sent when the scheduler finalises a completed session; includes energy used (kWh), total cost (AUD), and a note that the charge will appear on the next invoice
  3. `sendInvoiceNotification(user, invoice)` — sent when the admin generates invoices; includes the billing period and total amount due

All three functions are fire-and-forget — they run asynchronously after the main operation completes so email delivery issues never block the API response. Errors are logged via Pino but do not propagate to the caller.

**Integration points:**
- Booking creation (`apps/backend/src/routes/bookings.js`) — calls `sendBookingConfirmation` after the booking is saved to the database
- Session finalisation (`apps/backend/src/scheduler.js`) — calls `sendSessionSummary` after the session is closed and the booking is marked COMPLETED
- Invoice generation (`apps/backend/src/routes/invoices.js`) — calls `sendInvoiceNotification` for each invoice created

**Testing notifications:**
- Started Mailpit (`mailpit`) and confirmed it was listening on port 1025
- Created a new booking and confirmed the booking confirmation email appeared in the Mailpit web UI (http://localhost:8025)
- Triggered a session completion via the scheduler and confirmed the session summary email appeared in Mailpit
- Generated an invoice via the admin dashboard and confirmed the invoice notification email appeared for each resident

**Phase 4 complete. Tasks 7, 8, and 9 are all done.**

---

## Task Progress Updates

| Task | Description | Dates | Status |
|------|-------------|-------|--------|
| 1 | Define problem and requirements | 18–21 Apr | ✅ Done |
| 2 | Design system models (DFD, ERD, wireframes) | 22–25 Apr | ✅ Done |
| 3 | Set up development environment | 26–28 Apr | ✅ Done |
| 4 | Build database and authentication system | 29 Apr – 1 May | ✅ Done |
| 5 | Develop booking system | 2 May | ✅ Done |
| 6 | Implement charging simulation | 3 May | ✅ Done |
| 7 | Develop billing and invoicing | 16 May | ✅ Done |
| 8 | Build admin dashboard and charts | 16 May | ✅ Done |
| 9 | Implement notifications | 16 May | ✅ Done |
| 10 | Testing and user feedback | 9–10 May | ✅ Done |
| 11 | Documentation and process diary | Ongoing | 🔄 In Progress |
| 12 | Presentation preparation | TBD | ⏳ Upcoming |
| 13 | Final review and submission | By 25 May | ⏳ Upcoming |
