# ChargeShare — Test Plan and Test Outcomes

**Project:** ChargeShare — EV Charging Booking and Management System  
**Assessment:** Year 12 Enterprise Computing — Assessment Task 3 (Component A, Section 4)

---

## 1. Test Plan Overview

ChargeShare uses four testing methods as identified in the Implementation Plan (Section 3.1 of the project documentation). Each method serves a different purpose and together they provide confidence that the system meets all functional and non-functional requirements.

| Method | Purpose | When Applied |
|--------|---------|-------------|
| Functional Testing | Verify each feature behaves correctly for valid and invalid inputs | During development of each module |
| Acceptance Testing (UAT) | Confirm the system meets user needs from the resident and admin perspective | After each major feature is complete |
| Live Data Testing | Verify that simulated charging data, cost calculations and invoices are accurate over time | During and after charging simulation module |
| Volume Testing | Confirm the system handles multiple concurrent users without booking conflicts or data errors | Before final submission |

---

## 2. Test Environment

| Item | Detail |
|------|--------|
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:4000` |
| Test framework | Vitest v3 |
| HTTP testing library | Supertest v7 |
| Database | SQLite (`apps/backend/prisma/dev.db`) with seed data applied |
| How to start the system | `npm run db:setup` then `npm run dev` from the repository root |
| How to run automated tests | `npm run test --workspace apps/backend` from repository root |

> **Note:** Seed data must be applied before testing. Run `npm run db:setup` on a fresh clone to set up the database and seed accounts. All seed accounts use the password `ChangeMe123!`.

---

## 3. Test Cases and Outcomes

Each test case includes the steps to follow, the expected result, and a space for the actual result (screenshot or observation) to be recorded as testing progresses.

---

### Module: System Health Check

**Testing method:** Functional Testing

---

#### HC-01 — Verify the application loads and the server is running

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Open a terminal and run `npm run db:setup` from the project folder to start the backend
2. In a second terminal, run `npm run dev` to start the frontend
3. Open `http://localhost:5173` in a web browser
4. Observe that a page loads without any browser errors

**Expected Result:**  
The ChargeShare application loads in the browser. A login screen is displayed with fields for email and password, and an option to register. No error messages appear.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

### Module: Authentication

**Testing method:** Functional Testing

---

#### AUTH-01 — Register a new user account with valid details

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. The login screen appears. Click the **Register** button
3. The registration form appears. Enter `John Abraham` in the **Full Name** field
4. Enter `john.abraham@chargeshare.local` in the **Email** field
5. Enter `Password123!` in the **Password** field
6. Click the **Create Account** button

**Expected Result:**  
A confirmation message is displayed stating the account has been created successfully. The user is automatically logged in and redirected to the Resident Dashboard. The dashboard displays the user's name in the navigation bar and shows a list of available chargers.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-02 — Attempt to register using an email address that already has an account

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. Click the **Register** button
3. Enter `Test User` in the **Full Name** field
4. Enter `vishnu@chargeshare.local` in the **Email** field (this account already exists from the seed data)
5. Enter `Password123!` in the **Password** field
6. Click the **Create Account** button

**Expected Result:**  
The registration form remains on screen. An error message is displayed stating that the email address is already registered. The user is not logged in and no new account is created.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-03 — Attempt to register with an incorrectly formatted email address

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. Click the **Register** button
3. Enter `John Abraham` in the **Full Name** field
4. Enter `johnnotanemail` in the **Email** field (no @ symbol)
5. Enter `Password123!` in the **Password** field
6. Click the **Create Account** button

**Expected Result:**  
The form is not submitted. A validation error message appears next to the Email field indicating that the email address format is invalid. All other fields retain the values already entered.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-04 — Attempt to register with a password that is too short

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. Click the **Register** button
3. Enter `John Abraham` in the **Full Name** field
4. Enter `john.short@chargeshare.local` in the **Email** field
5. Enter `Test1` in the **Password** field (only 5 characters)
6. Click the **Create Account** button

**Expected Result:**  
The form is not submitted. A validation error message appears next to the Password field indicating that the password must be at least 8 characters long. The user is not registered.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-05 — Log in with a valid email address and correct password

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. The login screen is displayed
3. Enter `vishnu@chargeshare.local` in the **Email** field
4. Enter `ChangeMe123!` in the **Password** field
5. Click the **Log In** button

**Expected Result:**  
The login succeeds. The user is redirected to the Resident Dashboard. The navigation bar displays the user's name (`Vishnu`). No error messages appear.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-06 — Attempt to log in with a correct email but an incorrect password

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. The login screen is displayed
3. Enter `vishnu@chargeshare.local` in the **Email** field
4. Enter `WrongPassword!` in the **Password** field
5. Click the **Log In** button

**Expected Result:**  
Login fails. The user remains on the login screen. An error message is displayed stating "Invalid email or password". The message does not indicate whether the email address itself is correct, for security reasons.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-07 — Attempt to log in with an email address that does not exist

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. The login screen is displayed
3. Enter `unknown.user@chargeshare.local` in the **Email** field (this account does not exist)
4. Enter `Password123!` in the **Password** field
5. Click the **Log In** button

**Expected Result:**  
Login fails. The user remains on the login screen. The same error message is displayed as in AUTH-06: "Invalid email or password". The system does not reveal whether the email address is registered or not.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-08 — Attempt to access the Resident Dashboard without logging in

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Open a new browser tab that has no active ChargeShare session
2. Type `http://localhost:5173/dashboard` directly into the address bar and press Enter

**Expected Result:**  
The system does not display the Resident Dashboard. Instead, the user is automatically redirected to the login screen at `http://localhost:5173`. A message may appear indicating that login is required to access that page.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### AUTH-09 — Verify the session ends after logging out

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 2 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!` (following steps in AUTH-05)
2. Confirm the Resident Dashboard is displayed
3. Click the **Log Out** button in the navigation bar
4. After being redirected to the login screen, attempt to navigate back to `http://localhost:5173/dashboard` directly in the address bar

**Expected Result:**  
After logging out, the user is returned to the login screen. Attempting to navigate to the dashboard directly redirects back to the login screen again. The previous session is no longer active and the user cannot access any protected pages without logging in again.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

### Module: Charger Discovery and Booking

**Testing method:** Functional Testing

---

#### BOOK-01 — View the list of available chargers after logging in

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 9 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. On the Resident Dashboard, click the **Available Chargers** card
3. The Chargers page loads at `http://localhost:5173/chargers`

**Expected Result:**  
A list of chargers is displayed. Each charger shows its label (e.g. A1), location (e.g. Basement B1), and power rating (e.g. 7.2 kW). Charger A1 shows a booked slot for tomorrow 08:00–10:00 (seeded for Vishnu). Chargers A2 and B1 show no upcoming bookings. A **Book** button is visible on each charger card.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### BOOK-02 — Successfully book an available charger for a future time slot

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 9 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. Navigate to the Chargers page
3. Click **Book** on Charger B1
4. Set **Start Time** to any future date and time (e.g. two days from today at 2:00 PM)
5. Set **End Time** to the same date at 4:00 PM
6. Click **Confirm Booking**

**Expected Result:**  
The booking is accepted. The user is redirected to the My Bookings page. The new booking for Charger B1 appears in the list with status **CONFIRMED** and the selected start and end times displayed.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### BOOK-03 — Attempt to book a charger for a time slot that is already taken

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 9 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. Navigate to the Chargers page
3. Click **Book** on Charger A1 (which already has a seed booking for tomorrow 08:00–10:00)
4. Set **Start Time** to tomorrow at 08:00
5. Set **End Time** to tomorrow at 10:00
6. Click **Confirm Booking**

**Expected Result:**  
The booking is rejected. An error message is displayed stating that the charger is already booked for the selected time slot. The user remains on the booking form and no new booking is created.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### BOOK-04 — Cancel an upcoming confirmed booking

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 9 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. Navigate to the My Bookings page at `http://localhost:5173/bookings`
3. Locate the confirmed booking for Charger A1 (tomorrow 08:00–10:00)
4. Click the **Cancel** link below the booking status badge

**Expected Result:**  
The booking status changes to **CANCELLED**. The Cancel link disappears from that booking entry. The booking remains visible in the list with the red CANCELLED badge.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

### Module: Charging Session Simulation

**Testing method:** Functional Testing and Live Data Testing

---

#### SIM-01 — View charging session history for a completed session

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 9 May 2026 |

**Steps:**
1. Log in using `resident2@chargeshare.local` and `ChangeMe123!`
2. On the Resident Dashboard, click the **Charging Sessions** card
3. The Sessions page loads at `http://localhost:5173/sessions`

**Expected Result:**  
One completed session is displayed for Charger A2. The session shows yesterday's date, 14.40 kWh of energy used, and a cost of $8.64. A green **Completed** badge appears on the session card.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

---

#### SIM-02 — Verify the scheduler automatically starts and finalises a session

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 9 May 2026 |

**Steps:**
1. Ensure the backend is running (`npm run dev` from the project root)
2. Open Prisma Studio (`npm run prisma:studio --workspace apps/backend`) and navigate to the **Session** table
3. Create a test booking in the **Booking** table with a start time 1 minute in the future and end time 3 minutes in the future, status **CONFIRMED**
4. Wait 1–2 minutes, then refresh the Session table in Prisma Studio
5. Wait until the end time has passed, then refresh again

**Expected Result:**  
After the start time passes, a new Session row appears with `startedAt` matching the booking's start time and `energyKwh` increasing over time. After the end time passes, `endedAt` is set, `energyKwh` and `costAud` are finalised (calculated as power kW × duration h × $0.60/kWh), and the booking status changes to **COMPLETED**.

**Actual Result:**  
As Expected. Screenshots will be consolidated in a separate document where applicable.

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

| Task | User Type | Steps | Acceptance Criteria | Actual Result | Status |
|------|-----------|-------|---------------------|---------------|--------|
| Register a new account | Resident | Go to the app, click Register, fill in name, email and password, submit | Registration completes in under 2 minutes without needing help; confirmation is shown | *[Screenshot to be supplied]* | Pending |
| Log in and view available chargers | Resident | Enter email and password on the login screen, log in | Charger list is visible within 30 seconds of logging in | *[Screenshot to be supplied]* | Pending |
| Book a charger for a future time slot | Resident | Select a charger, choose a date and time, confirm booking | Booking is confirmed with no errors; confirmation appears on the dashboard | *[Screenshot to be supplied]* | Pending |
| Attempt to double-book an occupied slot | Resident | Try to book the same charger at the same time as an existing booking | A clear error message explains the slot is already taken; no duplicate booking is created | *[Screenshot to be supplied]* | Pending |
| View charging session history | Resident | Log in and navigate to the Sessions page | All past sessions are listed with kWh used and cost displayed | *[Screenshot to be supplied]* | Pending |
| View and understand a monthly invoice | Resident | Navigate to the Invoices page | Invoice total and billing period are clearly readable; individual session costs are itemised | *[Screenshot to be supplied]* | Pending |
| View the utilisation dashboard | Admin | Log in as admin (`admin@chargeshare.local`) and open the dashboard | Charts showing charger usage and billing data load correctly | *[Screenshot to be supplied]* | Pending |

---

## 5. Live Data Testing

Live data testing will be conducted once the charging simulation module is built (Task 6). The scheduler will run continuously for a test period and the following will be verified:

| Check | How to Verify | Acceptance Criteria | Actual Result | Status |
|-------|--------------|---------------------|---------------|--------|
| Session is created when a booking starts | Open Prisma Studio → Session table; check for a new row after the booking start time | A Session row exists with `startedAt` matching the booking's start time | *[To be recorded]* | Pending |
| Energy usage accumulates during the session | Refresh the Session row in Prisma Studio every minute during an active booking | The `energyKwh` value increases over time at a rate consistent with the charger's power rating | *[To be recorded]* | Pending |
| Session is finalised when the booking ends | Inspect the Session row after the booking end time | `endedAt` is set and `costAud` has been calculated correctly | *[To be recorded]* | Pending |
| Cost calculation is accurate | Manually calculate: `costAud = energyKwh × tariff rate`; compare to database value | Manual calculation matches the stored `costAud` for at least 3 test sessions | *[To be recorded]* | Pending |
| Invoice total matches the sum of session costs | Query Invoice and Sessions in Prisma Studio | Invoice `totalAud` equals the sum of all session costs for the same period | *[To be recorded]* | Pending |

---

## 6. Volume Testing

Volume testing will be conducted near the end of the project to verify the system handles load correctly.

| Check | How to Verify | Acceptance Criteria | Actual Result | Status |
|-------|--------------|---------------------|---------------|--------|
| Two users try to book the same charger at the same time | Log in as two different residents simultaneously and attempt to book the same charger slot at the same moment | Only one booking succeeds; the other user sees an error message saying the slot is unavailable | *[To be recorded]* | Pending |
| Multiple users book different chargers at the same time | Log in as three residents and book three different chargers at the same time | All three bookings succeed with no errors | *[To be recorded]* | Pending |
| Dashboard loads with a large amount of data | After seeding 50+ sessions, open the admin dashboard | The dashboard and all charts load within 3 seconds | *[To be recorded]* | Pending |

---

## 7. Test Summary

| Module | Total Tests | Passing | Failing | Pending |
|--------|------------|---------|---------|---------|
| Health Check | 1 | 1 | 0 | 0 |
| Authentication | 9 | 9 | 0 | 0 |
| Charger Discovery and Booking | 4 | 4 | 0 | 0 |
| Charging Session Simulation | 2 | 2 | 0 | 0 |
| Billing and Invoicing | — | — | — | Not built |
| Admin Dashboard | — | — | — | Not built |
| Email Notifications | — | — | — | Not built |
| **Total** | **16** | **16** | **0** | — |
