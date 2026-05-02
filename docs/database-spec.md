# ChargeShare Database Specification

Last updated: 26 April 2026  
Applies to: `apps/backend/prisma/schema.prisma`

## 1. Purpose

This document defines the ChargeShare database design for:

- local development and testing
- seed/sample data setup
- data exploration and verification
- production rollout planning (PostgreSQL cloud deployment)

## 2. Database Software and Tooling

### Local Development and Testing

- Database engine: SQLite
- ORM and schema management: Prisma
- Connection string (from `.env`):  
  `DATABASE_URL="file:./prisma/dev.db"`
- Benefits for this project:
  - zero server setup
  - fast reset/rebuild in a school project environment
  - easy file-level backup (`dev.db`)

### Production Rollout (Target)

- Database engine: PostgreSQL (managed cloud service, e.g. AWS RDS, Supabase, Azure Database for PostgreSQL, Neon)
- ORM/migrations remain Prisma
- Connection string format example:  
  `DATABASE_URL="postgresql://user:password@host:5432/chargeshare?schema=public"`

## 3. Logical Data Model

Current schema entities:

1. `Building`
2. `User`
3. `Charger`
4. `Booking`
5. `Session`
6. `Invoice`

Enums:

1. `UserRole`: `ADMIN`, `RESIDENT`
2. `BookingStatus`: `CONFIRMED`, `CANCELLED`, `COMPLETED`
3. `InvoiceStatus`: `DRAFT`, `SENT`, `PAID`

## 4. Entity Specifications

## `Building`

- Purpose: top-level container for users and chargers.
- Primary key: `id`
- Important fields:
  - `name` (required)
  - `address` (optional)
  - `createdAt`

## `User`

- Purpose: authenticated platform user (resident or admin).
- Primary key: `id`
- Foreign key: `buildingId -> Building.id`
- Important fields:
  - `fullName` (required)
  - `email` (required, unique)
  - `passwordHash` (required, never store plain text password)
  - `role` (`ADMIN` or `RESIDENT`)
  - `createdAt`

## `Charger`

- Purpose: EV charging point metadata.
- Primary key: `id`
- Foreign key: `buildingId -> Building.id`
- Important fields:
  - `label` (required, human-readable identifier)
  - `location` (optional, e.g. “Basement B2 Slot 14”)
  - `powerKw` (required, e.g. 7.2)
  - `isActive` (default `true`)
  - `createdAt`

## `Booking`

- Purpose: reservation of a charger for a time window.
- Primary key: `id`
- Foreign keys:
  - `userId -> User.id`
  - `chargerId -> Charger.id`
- Important fields:
  - `startAt`, `endAt`
  - `status` (default `CONFIRMED`)
  - `createdAt`
- Existing index:
  - `@@index([chargerId, startAt, endAt])` for availability checks

## `Session`

- Purpose: simulated charging outcome for one booking.
- Primary key: `id`
- Foreign key (unique): `bookingId -> Booking.id`
- Important fields:
  - `startedAt`, `endedAt`
  - `energyKwh` (default `0`)
  - `costAud` (default `0`)
  - `createdAt`
- Key rule:
  - one booking can produce at most one session

## `Invoice`

- Purpose: billing summary per user per period.
- Primary key: `id`
- Foreign key: `userId -> User.id`
- Important fields:
  - `periodStart`, `periodEnd`
  - `totalAud`
  - `status` (default `DRAFT`)
  - `createdAt`

## 5. Relationships (Cardinality)

1. `Building` 1 -> many `User`
2. `Building` 1 -> many `Charger`
3. `User` 1 -> many `Booking`
4. `Charger` 1 -> many `Booking`
5. `Booking` 1 -> 0..1 `Session`
6. `User` 1 -> many `Invoice`

## 6. Integrity and Business Rules

Database-level constraints already defined:

1. Unique user email (`User.email`)
2. One session per booking (`Session.bookingId @unique`)
3. FK references across all linked entities
4. Booking-time lookup index for charger availability

Application-level rules (enforced in backend services):

1. reject booking if user is unauthenticated
2. reject booking if charger is inactive/unavailable
3. reject booking if timeslot overlaps existing booking
4. reject booking if booking violates fairness/business policy

Note: In PostgreSQL phase, overlap checks can be strengthened with exclusion constraints or transactional locking for race-condition protection.

## 7. Seed Data Specification (System Setup)

Minimum baseline seed data recommended for project demos:

1. 1 building
2. 1 admin user
3. 3 resident users
4. 3 chargers
5. optional: 2-4 bookings
6. optional: 2 sessions linked to bookings
7. optional: 1 invoice per resident for one sample period

### Suggested Baseline Seed Values

## Building

- `name`: `ChargeShare Demo Building`
- `address`: `100 Example St, Sydney NSW`

## Admin User

- `fullName`: `Building Admin`
- `email`: `admin@chargeshare.local`
- `role`: `ADMIN`

## Resident Users

1. `vishnu@chargeshare.local`
2. `resident2@chargeshare.local`
3. `resident3@chargeshare.local`

## Chargers

1. `A1`, 7.2kW, Basement B1
2. `A2`, 7.2kW, Basement B1
3. `B1`, 11kW, Basement B2

### Seed Password Guidance

- Use bcrypt hashing in seed script.
- Do not commit plain text production passwords.
- For local/demo only, document a temporary password in developer notes (for example: `ChangeMe123!`).

## 8. Sample Data (for UI/Testing)

Example sample row concepts:

1. Booking:
   - User: `vishnu@chargeshare.local`
   - Charger: `A1`
   - `startAt`: `2026-05-10T08:00:00+10:00`
   - `endAt`: `2026-05-10T09:30:00+10:00`
2. Session:
   - `energyKwh`: `7.2`
   - `costAud`: `4.32`
3. Invoice:
   - `periodStart`: `2026-05-01T00:00:00+10:00`
   - `periodEnd`: `2026-05-31T23:59:59+10:00`
   - `totalAud`: `18.40`

## 9. Local Database Setup Workflow

### First-time setup (new clone or clean machine)

**Step 1 — Copy the environment file (one time only):**

```bash
cp apps/backend/.env.example apps/backend/.env
```

**Step 2 — Run the single setup script:**

```bash
npm run db:setup
```

This one command does everything in sequence:

| Step | What happens |
|------|-------------|
| `prisma generate` | Generates the Prisma Client from the schema |
| `prisma migrate dev --name init` | Creates and applies the SQLite database migration |
| `prisma db seed` | Inserts baseline data (building, admin, 3 residents, 3 chargers) |
| `prisma studio` | Opens the database browser at `http://localhost:5555` |

The seed is idempotent — running `db:setup` again will not duplicate data.

### Restarting Prisma Studio only

If the database is already set up and you just want to open the browser:

```bash
npm run prisma:studio --workspace apps/backend
```

### Resetting the database (destructive, dev only)

Wipes all data and reruns migrations and seed from scratch:

```bash
cd apps/backend && npx prisma migrate reset
```

## 10. How to Explore Database Tables

### Prisma Studio (Recommended)

```bash
npm run prisma:studio --workspace apps/backend
```

This opens a table browser/editor for all models.

### SQLite CLI

```bash
sqlite3 apps/backend/prisma/dev.db ".tables"
sqlite3 apps/backend/prisma/dev.db "SELECT id, email, role FROM User;"
sqlite3 apps/backend/prisma/dev.db "SELECT id, label, powerKw, isActive FROM Charger;"
sqlite3 apps/backend/prisma/dev.db "SELECT id, chargerId, startAt, endAt, status FROM Booking;"
```

### Optional GUI Tools

- DB Browser for SQLite
- TablePlus / DBeaver

## 11. Production Rollout Plan (PostgreSQL + Seed Deployment)

Target phase: after prototype stabilisation and before final production-like deployment.

### Step 1: Provision PostgreSQL

Create cloud PostgreSQL and capture:

- host
- port
- database name
- username/password
- TLS/SSL requirement

### Step 2: Update Prisma Datasource

In `apps/backend/prisma/schema.prisma`, switch:

- `provider = "sqlite"` -> `provider = "postgresql"`
- update `DATABASE_URL` in deployment environment

### Step 3: Baseline and Apply Migrations

Development (create migrations):

```bash
npx prisma migrate dev --schema apps/backend/prisma/schema.prisma --name init_postgres
```

Deployment (apply committed migrations):

```bash
npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma
```

### Step 4: Deploy Seed Data

Use idempotent seed script (upsert pattern) so reruns are safe:

```bash
npx prisma db seed --schema apps/backend/prisma/schema.prisma
```

Production seed should include only:

1. required reference/config data
2. initial admin account/bootstrap data

Production seed should not include:

1. fake residents
2. fake bookings/sessions/invoices

### Step 5: Verify Post-Deployment Data

Validation checklist:

1. migrations applied successfully
2. required tables and indexes exist
3. admin account and baseline records exist
4. API healthcheck passes
5. booking, session, and invoice flows pass smoke tests

## 12. CI/CD Recommendations for Database Changes

For each schema change PR:

1. update `schema.prisma`
2. generate migration
3. run lint/tests
4. run migration on a staging PostgreSQL instance
5. run seed (staging-safe data only)
6. run smoke tests

Recommended deployment order:

1. deploy migrations
2. deploy application code
3. deploy seed/bootstrap script
4. run verification checks

## 13. Next Build Tasks (Database Phase)

1. add `apps/backend/prisma/seed.js` with idempotent baseline seed
2. add npm script for seeding (`prisma:seed`)
3. implement booking overlap query and transaction-safe booking creation
4. add unit/integration tests for seed and booking constraints

## 14. Practical Guide: Exploring Data with Free Tools

Three free tools can be used to inspect, query, and verify ChargeShare data at any point during development. Each is described below with step-by-step instructions.

---

### Tool 1 — Prisma Studio (Browser-based table viewer)

**What it is:** A visual table browser built into Prisma. Runs in a browser tab and shows every model as a spreadsheet-style grid. No installation beyond what is already in the project.

**How to start it:**

```bash
# From the repository root
npm run prisma:studio --workspace apps/backend
```

Prisma Studio opens automatically at `http://localhost:5555`.

**What you can do:**

| Action | How |
|--------|-----|
| Browse all tables | Click any model name in the left sidebar (Building, User, Charger, Booking, Session, Invoice) |
| Filter rows | Use the **Add filter** button above the grid to filter by any field (e.g. `role = ADMIN`) |
| Add a test row | Click **+ Add record** and fill in the fields directly in the browser |
| Edit a value | Click any cell to edit it inline and press **Save 1 change** |
| Delete a row | Hover a row and click the trash icon on the left, then confirm |
| Follow relationships | Click the linked record count in a relation column (e.g. `3 Bookings`) to jump to those rows |

**When to use it:** Best for visually verifying seed data, checking that a booking was created correctly, or quickly editing a test value without restarting the server.

---

### Tool 2 — DB Browser for SQLite (Free desktop GUI)

**What it is:** A free, open-source desktop application for browsing and querying SQLite database files directly. Available for macOS, Windows, and Linux.

**Download:** [sqlitebrowser.org](https://sqlitebrowser.org) — click **Download** and choose the installer for your operating system. No account required.

**How to open the ChargeShare database:**

1. Open DB Browser for SQLite.
2. Click **Open Database** (top-left toolbar).
3. Navigate to `apps/backend/prisma/dev.db` inside the project folder and click **Open**.
4. The left panel shows all tables under the **Database Structure** tab.

**Key tabs:**

| Tab | Purpose |
|-----|---------|
| Database Structure | Lists all tables, columns, indexes, and their types |
| Browse Data | Spreadsheet view of any table; use the **Table** dropdown to switch |
| Execute SQL | Type and run any SQL query against the database |

**Useful SQL queries to run in Execute SQL:**

```sql
-- List all users with their role
SELECT id, fullName, email, role FROM User ORDER BY role;

-- List all chargers
SELECT id, label, location, powerKw, isActive FROM Charger;

-- Show bookings with user email and charger label
SELECT
  b.id,
  u.email AS resident,
  c.label AS charger,
  b.startAt,
  b.endAt,
  b.status
FROM Booking b
JOIN User u ON b.userId = u.id
JOIN Charger c ON b.chargerId = c.id
ORDER BY b.startAt;

-- Show sessions with calculated cost
SELECT
  s.id,
  s.bookingId,
  s.energyKwh,
  s.costAud,
  s.startedAt,
  s.endedAt
FROM Session s
ORDER BY s.startedAt DESC;

-- Show invoices per user
SELECT
  i.id,
  u.email,
  i.periodStart,
  i.periodEnd,
  i.totalAud,
  i.status
FROM Invoice i
JOIN User u ON i.userId = u.id
ORDER BY i.periodStart DESC;
```

**Important:** DB Browser opens the `.db` file directly. If the backend server is also running at the same time, close DB Browser or use **File → Close Database** before running `prisma migrate reset` to avoid file-lock errors.

**When to use it:** Best for running custom SQL joins, verifying data integrity across multiple tables, and taking screenshots for project documentation.

---

### Tool 3 — SQLite CLI (Built-in command-line tool)

**What it is:** The `sqlite3` command-line tool that ships with macOS and most Linux distributions. No installation needed on macOS.

**Check it is available:**

```bash
sqlite3 --version
```

**Open the database:**

```bash
sqlite3 apps/backend/prisma/dev.db
```

The prompt changes to `sqlite>`. Type `.quit` to exit.

**Useful dot commands:**

```
.tables              -- list all table names
.schema User         -- show the CREATE TABLE statement for User
.schema Booking      -- show the Booking table definition including indexes
.headers on          -- show column names in query output
.mode column         -- align output into readable columns
.quit                -- exit the CLI
```

**Quick inspection commands (run from the project root without entering the REPL):**

```bash
# List all tables
sqlite3 apps/backend/prisma/dev.db ".tables"

# Count rows in each table
sqlite3 apps/backend/prisma/dev.db "SELECT 'User' AS tbl, COUNT(*) FROM User UNION ALL SELECT 'Charger', COUNT(*) FROM Charger UNION ALL SELECT 'Booking', COUNT(*) FROM Booking UNION ALL SELECT 'Session', COUNT(*) FROM Session UNION ALL SELECT 'Invoice', COUNT(*) FROM Invoice;"

# Check all users
sqlite3 apps/backend/prisma/dev.db "SELECT id, fullName, email, role FROM User;"

# Check for overlapping bookings on a charger
sqlite3 apps/backend/prisma/dev.db "SELECT id, chargerId, startAt, endAt, status FROM Booking WHERE chargerId = 1 ORDER BY startAt;"
```

**When to use it:** Best for quick one-line checks during development — for example, verifying a seed ran correctly or confirming a booking was written to the database after an API call.

---

### Choosing the Right Tool

| Situation | Recommended Tool |
|-----------|-----------------|
| Quickly check seed data loaded correctly | Prisma Studio or SQLite CLI |
| Browse all rows in a table visually | Prisma Studio or DB Browser |
| Run a JOIN across multiple tables | DB Browser (Execute SQL tab) |
| Screenshot tables for project documentation | DB Browser (Browse Data tab) |
| Verify row counts from the terminal | SQLite CLI |
| Edit a test value without restarting the server | Prisma Studio |
