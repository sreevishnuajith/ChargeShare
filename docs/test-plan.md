# ChargeShare — Test Plan and Test Outcomes

**Project:** ChargeShare — EV Charging Booking and Management System  
**Assessment:** Year 12 Enterprise Computing — Assessment Task 3 (Component A, Section 4)

---

## 1. Test Plan Overview

ChargeShare uses four testing methods as identified in the Implementation Plan (Section 3.1 of the project documentation). Each method serves a different purpose and together they provide confidence that the system meets all functional and non-functional requirements.

| Method | Purpose | When Applied |
|--------|---------|-------------|
| Functional Testing | Verify each API endpoint behaves correctly for valid and invalid inputs | During development of each module |
| Acceptance Testing (UAT) | Confirm the system meets user needs from the resident and admin perspective | After each major feature is complete |
| Live Data Testing | Verify that simulated charging data, cost calculations and invoices are accurate over time | During and after charging simulation module |
| Volume Testing | Confirm the system handles multiple concurrent users without booking conflicts or data errors | Before final submission |

---

## 2. Test Environment

| Item | Detail |
|------|--------|
| Test framework | Vitest v3 |
| HTTP testing library | Supertest v7 |
| Database | SQLite (`apps/backend/prisma/dev.db`) with seed data applied |
| JWT secret (tests) | `test-jwt-secret-vitest` (set in `vitest.config.js`) |
| How to run all tests | `npm run test --workspace apps/backend` from repository root |

> **Note:** Tests require the seed data to be present (building id=1 must exist for `buildingId` references in registration tests). Run `npm run db:setup` before running tests on a fresh clone.

---

## 3. Test Cases and Outcomes

---

### Module: Health Check

**Endpoint:** `GET /health`  
**Test file:** `src/app.test.js`  
**Testing method:** Functional Testing

| ID | Test Case | Input | Expected Result | Actual Result | Status | Date |
|----|-----------|-------|-----------------|---------------|--------|------|
| HC-01 | Server is running and healthy | `GET /health` (no body) | `200 OK`, body contains `status: "ok"` | `200 OK`, `{ status: "ok", app: "ChargeShare API", timestamp: "..." }` | ✅ Pass | 2 May 2026 |

---

### Module: Authentication

**Endpoints:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me`  
**Test file:** `src/routes/auth.test.js`  
**Testing method:** Functional Testing

#### POST /auth/register

| ID | Test Case | Input | Expected Result | Actual Result | Status | Date |
|----|-----------|-------|-----------------|---------------|--------|------|
| AUTH-01 | Successful registration | Valid `fullName`, `email`, `password` (≥8 chars), `buildingId: 1` | `201 Created`, body contains `user` object and `token`; `passwordHash` not present in response | `201 Created`, JWT token returned, `passwordHash` absent | ✅ Pass | 2 May 2026 |
| AUTH-02 | Duplicate email rejected | Same email submitted twice | Second request returns `409 Conflict`, error message indicates email is already registered | `409 Conflict` with `{ error: "Email already registered" }` | ✅ Pass | 2 May 2026 |
| AUTH-03 | Invalid email format rejected | `email: "not-an-email"` | `400 Bad Request`, validation error on email field | `400 Bad Request` with field-level Zod validation error | ✅ Pass | 2 May 2026 |
| AUTH-04 | Short password rejected | `password: "abc"` (3 characters) | `400 Bad Request`, validation error on password field | `400 Bad Request` with field-level Zod validation error | ✅ Pass | 2 May 2026 |

#### POST /auth/login

| ID | Test Case | Input | Expected Result | Actual Result | Status | Date |
|----|-----------|-------|-----------------|---------------|--------|------|
| AUTH-05 | Successful login | Correct email and password for an existing user | `200 OK`, body contains `user` object and `token`; `passwordHash` not present | `200 OK`, JWT token returned, `passwordHash` absent | ✅ Pass | 2 May 2026 |
| AUTH-06 | Wrong password rejected | Correct email, incorrect password | `401 Unauthorised`, generic error message (does not reveal whether email exists) | `401 Unauthorised` with `{ error: "Invalid email or password" }` | ✅ Pass | 2 May 2026 |
| AUTH-07 | Unknown email rejected | Email not in database, any password | `401 Unauthorised`, same generic error message as AUTH-06 | `401 Unauthorised` with `{ error: "Invalid email or password" }` | ✅ Pass | 2 May 2026 |

#### GET /auth/me

| ID | Test Case | Input | Expected Result | Actual Result | Status | Date |
|----|-----------|-------|-----------------|---------------|--------|------|
| AUTH-08 | Valid token returns user profile | `Authorization: Bearer <valid-token>` | `200 OK`, body contains `user` with `id`, `fullName`, `email`, `role`; `passwordHash` absent | `200 OK`, correct user profile returned without sensitive fields | ✅ Pass | 2 May 2026 |
| AUTH-09 | Request with no token rejected | No `Authorization` header | `401 Unauthorised` | `401 Unauthorised` with `{ error: "Missing or invalid Authorization header" }` | ✅ Pass | 2 May 2026 |
| AUTH-10 | Malformed token rejected | `Authorization: Bearer not.a.real.token` | `401 Unauthorised` | `401 Unauthorised` with `{ error: "Invalid or expired token" }` | ✅ Pass | 2 May 2026 |

---

### Module: Charger Discovery and Booking

> *(To be completed — Task 5)*

---

### Module: Charging Session Simulation

> *(To be completed — Task 6)*

---

### Module: Billing and Invoicing

> *(To be completed — Task 7)*

---

### Module: Admin Dashboard

> *(To be completed — Task 8)*

---

### Module: Email Notifications

> *(To be completed — Task 9)*

---

## 4. Acceptance Testing (UAT)

Acceptance testing will be conducted after all core modules are complete. Test users will be asked to complete the following tasks without guidance and provide feedback on usability.

| Task | User Type | Acceptance Criteria |
|------|-----------|---------------------|
| Register a new account | Resident | Completes registration in under 2 minutes without assistance |
| Log in and view available chargers | Resident | Locates charger list within 30 seconds of logging in |
| Book a charger for a future time slot | Resident | Booking confirmed with no errors; confirmation visible on dashboard |
| Attempt to double-book an occupied slot | Resident | System rejects the booking with a clear error message |
| View charging session history | Resident | Sessions listed with kWh and cost displayed |
| View and understand monthly invoice | Resident | Invoice total and period are clearly readable |
| View utilisation dashboard | Admin | Dashboard loads with charts showing charger usage and billing data |

---

## 5. Live Data Testing

Live data testing will be conducted once the charging simulation module is built (Task 6). The scheduler will run continuously for a test period and the following will be verified:

| Check | Method | Acceptance Criteria |
|-------|--------|---------------------|
| Session created at booking start time | Inspect Session table in Prisma Studio | `startedAt` matches booking `startAt` within 1 minute |
| Energy accumulates over session duration | Query Session after each cron tick | `energyKwh` increases proportional to charger `powerKw` |
| Session finalised at booking end time | Inspect Session after `endAt` | `endedAt` set, `costAud` calculated correctly |
| Cost formula accuracy | Manual calculation | `costAud = energyKwh × tariff rate`; verified against 3 sample sessions |
| Invoice total matches sum of session costs | Query Invoice and Sessions | Invoice `totalAud` equals sum of all session `costAud` for the period |

---

## 6. Volume Testing

Volume testing will be conducted near the end of the project to verify the system handles load correctly.

| Check | Method | Acceptance Criteria |
|-------|--------|---------------------|
| Concurrent booking requests for the same slot | Send overlapping requests in rapid sequence | Only one booking is accepted; all others return `409` |
| Multiple users booking different chargers simultaneously | Simulate 3 users booking 3 different chargers at the same time | All 3 bookings succeed with no errors |
| Large number of sessions in database | Seed 50+ sessions and load admin dashboard | Dashboard loads within 3 seconds |

---

## 7. Test Summary

| Module | Total Tests | Passing | Failing | Pending |
|--------|------------|---------|---------|---------|
| Health Check | 1 | 1 | 0 | 0 |
| Authentication | 10 | 10 | 0 | 0 |
| Charger Discovery and Booking | — | — | — | Not built |
| Charging Session Simulation | — | — | — | Not built |
| Billing and Invoicing | — | — | — | Not built |
| Admin Dashboard | — | — | — | Not built |
| Email Notifications | — | — | — | Not built |
| **Total** | **11** | **11** | **0** | — |
