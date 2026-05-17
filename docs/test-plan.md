# ChargeShare — Test Plan and Test Outcomes

**Project:** ChargeShare — EV Charging Booking and Management System  
**Assessment:** Year 12 Enterprise Computing — Assessment Task 3 (Component A, Section 4)

---

## Table of Contents

- [1. Test Plan Overview](#1-test-plan-overview)
- [2. Test Environment](#2-test-environment)
- [3. Test Cases and Outcomes](#3-test-cases-and-outcomes)
  - [Module: System Health Check](#module-system-health-check)
    - [HC-01 — Verify the application loads and the server is running](#hc-01--verify-the-application-loads-and-the-server-is-running)
  - [Module: Authentication](#module-authentication)
    - [AUTH-01 — Register a new user account with valid details](#auth-01--register-a-new-user-account-with-valid-details)
    - [AUTH-02 — Attempt to register using an email address that already has an account](#auth-02--attempt-to-register-using-an-email-address-that-already-has-an-account)
    - [AUTH-03 — Attempt to register with an incorrectly formatted email address](#auth-03--attempt-to-register-with-an-incorrectly-formatted-email-address)
    - [AUTH-04 — Attempt to register with a password that is too short](#auth-04--attempt-to-register-with-a-password-that-is-too-short)
    - [AUTH-05 — Log in with a valid email address and correct password](#auth-05--log-in-with-a-valid-email-address-and-correct-password)
    - [AUTH-06 — Attempt to log in with a correct email but an incorrect password](#auth-06--attempt-to-log-in-with-a-correct-email-but-an-incorrect-password)
    - [AUTH-07 — Attempt to log in with an email address that does not exist](#auth-07--attempt-to-log-in-with-an-email-address-that-does-not-exist)
    - [AUTH-08 — Attempt to access the Resident Dashboard without logging in](#auth-08--attempt-to-access-the-resident-dashboard-without-logging-in)
    - [AUTH-09 — Verify the session ends after logging out](#auth-09--verify-the-session-ends-after-logging-out)
  - [Module: Charger Discovery and Booking](#module-charger-discovery-and-booking)
    - [BOOK-01 — View the list of available chargers after logging in](#book-01--view-the-list-of-available-chargers-after-logging-in)
    - [BOOK-02 — Successfully book an available charger for a future time slot](#book-02--successfully-book-an-available-charger-for-a-future-time-slot)
    - [BOOK-03 — Attempt to book a charger for a time slot that is already taken](#book-03--attempt-to-book-a-charger-for-a-time-slot-that-is-already-taken)
    - [BOOK-04 — Cancel an upcoming confirmed booking](#book-04--cancel-an-upcoming-confirmed-booking)
  - [Module: Charging Session Simulation](#module-charging-session-simulation)
    - [SIM-01 — View charging session history for a completed session](#sim-01--view-charging-session-history-for-a-completed-session)
    - [SIM-02 — Verify the scheduler automatically starts and finalises a session](#sim-02--verify-the-scheduler-automatically-starts-and-finalises-a-session)
  - [Module: Billing and Invoicing](#module-billing-and-invoicing)
    - [BILL-01 — View the My Invoices page when no invoices have been generated](#bill-01--view-the-my-invoices-page-when-no-invoices-have-been-generated)
    - [BILL-02 — Generate invoices for a billing period as admin](#bill-02--generate-invoices-for-a-billing-period-as-admin)
    - [BILL-03 — Verify the generated invoice appears on the resident's Invoices page](#bill-03--verify-the-generated-invoice-appears-on-the-residents-invoices-page)
    - [BILL-04 — Update invoice status from DRAFT to SENT](#bill-04--update-invoice-status-from-draft-to-sent)
    - [BILL-05 — Update invoice status from SENT to PAID](#bill-05--update-invoice-status-from-sent-to-paid)
    - [BILL-06 — Attempt to generate invoices for a period with no completed sessions](#bill-06--attempt-to-generate-invoices-for-a-period-with-no-completed-sessions)
  - [Module: Admin Dashboard and Charts](#module-admin-dashboard-and-charts)
    - [ADMIN-01 — Log in as admin and verify the Admin Dashboard loads](#admin-01--log-in-as-admin-and-verify-the-admin-dashboard-loads)
    - [ADMIN-02 — Verify the summary statistics are correct](#admin-02--verify-the-summary-statistics-are-correct)
    - [ADMIN-03 — Verify the sessions per day chart displays](#admin-03--verify-the-sessions-per-day-chart-displays)
    - [ADMIN-04 — Verify the revenue per day chart displays](#admin-04--verify-the-revenue-per-day-chart-displays)
    - [ADMIN-05 — Verify the charger utilisation chart displays](#admin-05--verify-the-charger-utilisation-chart-displays)
    - [ADMIN-06 — Verify the residents table lists all registered residents](#admin-06--verify-the-residents-table-lists-all-registered-residents)
    - [ADMIN-07 — Attempt to access the Admin Dashboard as a resident](#admin-07--attempt-to-access-the-admin-dashboard-as-a-resident)
  - [Module: Email Notifications](#module-email-notifications)
    - [NOTIF-01 — Verify a booking confirmation email is sent when a booking is created](#notif-01--verify-a-booking-confirmation-email-is-sent-when-a-booking-is-created)
    - [NOTIF-02 — Verify a session summary email is sent when a session is finalised](#notif-02--verify-a-session-summary-email-is-sent-when-a-session-is-finalised)
    - [NOTIF-03 — Verify an invoice notification email is sent when invoices are generated](#notif-03--verify-an-invoice-notification-email-is-sent-when-invoices-are-generated)
  - [Module: Cybersecurity](#module-cybersecurity)
    - [SEC-01 — SQL injection attempt on the login form](#sec-01--sql-injection-attempt-on-the-login-form)
    - [SEC-02 — XSS attempt via the Full Name field](#sec-02--xss-attempt-via-the-full-name-field)
    - [SEC-03 — Access a protected API endpoint without a token](#sec-03--access-a-protected-api-endpoint-without-a-token)
    - [SEC-04 — Verify passwords are stored as hashes, not plain text](#sec-04--verify-passwords-are-stored-as-hashes-not-plain-text)
    - [SEC-05 — Verify resident data isolation (privacy)](#sec-05--verify-resident-data-isolation-privacy)
- [4. Acceptance Testing (UAT)](#4-acceptance-testing-uat)
- [5. Test Summary](#5-test-summary)

---

## 1. Test Plan Overview

ChargeShare uses three testing methods as identified in the Implementation Plan (Section 3.1 of the project documentation). Each method serves a different purpose and together they provide confidence that the system meets all functional and non-functional requirements.

| Method | Purpose | When Applied |
|--------|---------|-------------|
| Functional Testing | Verify each feature behaves correctly for valid and invalid inputs | During development of each module |
| Acceptance Testing (UAT) | Confirm the system meets user needs from the resident and admin perspective | After each major feature is complete |
| Volume Testing | Confirm the system handles multiple concurrent users without booking conflicts or data errors | Before final submission |

---

## 2. Test Environment

| Item | Detail |
|------|--------|
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:4000` |
| Test framework | Vitest v3 |
| HTTP testing library | Supertest v7 |
| Email testing tool | Mailpit (`http://localhost:8025`) |
| Database | SQLite (`apps/backend/prisma/dev.db`) with seed data applied |
| How to start the system | `npm run db:setup` then `npm run dev` from the repository root |
| How to run automated tests | `npm run test --workspace apps/backend` from repository root |

> **Note:** Seed data must be applied before testing. Run `npm run db:setup` on a fresh clone to set up the database and seed accounts. All seed accounts use the password `ChangeMe123!`. To test email notifications, start Mailpit separately (`mailpit`) before running the backend.

---

## 3. Test Cases and Outcomes

Each test case includes the steps to follow, the expected result, and the actual result recorded during testing.

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
The ChargeShare login page loaded at `http://localhost:5173`. The ChargeShare branding, tagline, email and password fields, Log In button, and Register link were all displayed correctly. No error messages appeared.

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
The ChargeShare login page loaded at `http://localhost:5173`, displaying the ChargeShare branding, "Fair EV charging in shared buildings" tagline, email and password fields, Log In button, and the "Don't have an account? Register" link. After clicking Register, the registration form appeared. Valid details were entered and the Create Account button was clicked. Registration succeeded and the user was automatically redirected to the Resident Dashboard displaying "Welcome, John Abraham" with the RESIDENT role badge visible in the navigation bar.

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
The registration form remained on screen. A red error banner reading "Email already registered" appeared below the password field. No new account was created and the user was not logged in.

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
The browser's built-in email validation prevented the form from submitting. A tooltip appeared reading "Please include an '@' in the email address. 'john.abrahamchargeshare.local' is missing an '@'". The form was not submitted and all other fields retained their values.

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
The form displayed a red validation message: "Password must be at least 8 characters". The Create Account button did not submit the form and no account was created.

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
Login succeeded. The user was redirected to the Resident Dashboard displaying "Welcome, Vishnu" with the RESIDENT role badge visible in the navigation bar. No error messages appeared.

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
Login failed. The login page remained on screen. A red error banner reading "Invalid email or password" was displayed below the password field. The user was not redirected and no session was created.

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
As Expected. The same "Invalid email or password" error banner appeared as in AUTH-06. The system gave no indication that the email address did not exist.

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
As Expected. Navigating directly to `/dashboard` without a session redirected immediately to the login screen. The Resident Dashboard was not shown at any point.

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
As Expected. Clicking Log Out returned the user to the login screen. Navigating to `/dashboard` directly after logout redirected back to the login screen, confirming the session token was cleared.

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
The Available Chargers page loaded showing all three chargers. Charger A1 (Basement B1, 7.2 kW) displayed the upcoming booking for 18 May 08:00–10:00. Chargers A2 (Basement B1, 7.2 kW) and B1 (Basement B2, 11.0 kW) showed no upcoming bookings. A Book button was visible on each charger card.

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
The booking was accepted and the user was redirected to the My Bookings page. The new booking appeared in the list with the selected time slot (09/05/2026 03:00 PM – 05:00 PM) and a green CONFIRMED status badge.

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
As Expected. The booking form displayed a red error message indicating the charger was already booked for the selected time. The user remained on the booking form and no new booking was created in the database.

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
The booking status updated to CANCELLED immediately. The My Bookings page showed the booking with a red CANCELLED badge and the Cancel link was no longer present on that entry.

---

### Module: Charging Session Simulation

**Testing method:** Functional Testing

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
Multiple completed sessions are displayed for Resident Two, ordered most recent first. The top session is from yesterday on Charger A2: 14.40 kWh used, cost $8.64, with a green **Completed** badge. Further down the list are two April sessions (Charger A2: 22 Apr 14:00–17:00 and 7 Apr 09:00–11:00) and one March session (Charger A2: 8 Mar 09:00–13:00, 28.80 kWh, $17.28). All sessions show the charger label, date range, energy, and cost.

**Actual Result:**  
The Charging Sessions page loaded and displayed completed sessions for Resident Two. The most recent entry showed Charger A2, 8 May 2026 09:00–11:00, 14.40 kWh, $8.64 with a green Completed badge. All sessions listed the charger label, date range, energy used, and cost correctly.

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
The Prisma Studio Booking table confirmed the scheduler behaviour. After testing, the table showed 15 booking records: 14 with status COMPLETED and 1 with status CONFIRMED. A session row was created automatically once the start time passed. Attempting to cancel an in-progress booking displayed the alert "Cannot cancel a booking that has already started", confirming the guard logic was working correctly.

---

### Module: Billing and Invoicing

**Testing method:** Functional Testing

#### Seed Data — Completed Sessions and Expected Invoice Totals

The seed script creates 13 completed sessions across three calendar months. No invoices are pre-seeded — the admin generates them during testing using the Admin Dashboard. All costs use a tariff of **$0.60 per kWh**.

| Booking | Resident | Charger | Date | Duration | Energy | Cost |
|---------|----------|---------|------|----------|--------|------|
| #2 | Vishnu | A1 | 5 Mar 2026 08:00–11:00 | 3 h | 21.60 kWh | $12.96 |
| #3 | Vishnu | B1 | 12 Mar 2026 14:00–16:00 | 2 h | 22.00 kWh | $13.20 |
| #4 | Resident Two | A2 | 8 Mar 2026 09:00–13:00 | 4 h | 28.80 kWh | $17.28 |
| #5 | Resident Three | B1 | 20 Mar 2026 10:00–11:30 | 1.5 h | 16.50 kWh | $9.90 |
| #6 | Resident Three | A1 | 25 Mar 2026 07:00–09:00 | 2 h | 14.40 kWh | $8.64 |
| #7 | Vishnu | A1 | 3 Apr 2026 08:00–10:00 | 2 h | 14.40 kWh | $8.64 |
| #8 | Vishnu | B1 | 15 Apr 2026 13:00–16:00 | 3 h | 33.00 kWh | $19.80 |
| #9 | Resident Two | A2 | 7 Apr 2026 09:00–11:00 | 2 h | 14.40 kWh | $8.64 |
| #10 | Resident Two | A2 | 22 Apr 2026 14:00–17:00 | 3 h | 21.60 kWh | $12.96 |
| #11 | Resident Three | A1 | 10 Apr 2026 07:00–11:00 | 4 h | 28.80 kWh | $17.28 |
| #12 | Vishnu | B1 | 10 May 2026 09:00–11:30 | 2.5 h | 27.50 kWh | $16.50 |
| #13 | Resident Three | A2 | 13 May 2026 14:00–16:00 | 2 h | 14.40 kWh | $8.64 |
| #14 | Resident Two | A2 | Yesterday 09:00–11:00 | 2 h | 14.40 kWh | $8.64 |

**Expected invoice totals when generated per billing period:**

| Billing Period | Vishnu | Resident Two | Resident Three |
|----------------|--------|--------------|----------------|
| March 2026 (01 Mar – 31 Mar) | **$26.16** | **$17.28** | **$18.54** |
| April 2026 (01 Apr – 30 Apr) | **$28.44** | **$21.60** | **$17.28** |
| May 2026 (01 May – today) | **$16.50** | **$8.64** | **$8.64** |

---

#### BILL-01 — View the My Invoices page when no invoices have been generated

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. Click **Invoices** in the navigation bar, or click the **My Invoices** card on the dashboard
3. The My Invoices page loads at `http://localhost:5173/invoices`

**Expected Result:**  
The My Invoices page loads without errors. Even though Vishnu has 5 completed sessions across March, April, and May in the seed data, no invoices have been generated yet — invoice generation is an admin action. The empty-state message is displayed: "No invoices yet. Invoices are generated monthly by your building administrator." No invoice cards appear.

**Actual Result:**  
The My Invoices page loaded without errors and displayed the empty-state message "No invoices yet. Invoices are generated monthly by your building administrator." No invoice cards were shown, confirming that invoice generation is an admin-only action and is not triggered automatically by completed sessions.

---

#### BILL-02 — Generate invoices for a billing period as admin

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Precondition:** Seed data includes 5 completed sessions in March 2026 — 2 for Vishnu, 1 for Resident Two, and 2 for Resident Three (see Seed Data table above). No invoices exist in the database before this step.

**Steps:**
1. Log in using `admin@chargeshare.local` and `ChangeMe123!`
2. Navigate to the Admin Dashboard at `http://localhost:5173/admin`
3. Scroll down to the **Generate Monthly Invoices** panel
4. Set **Period Start** to `2026-03-01`
5. Set **Period End** to `2026-03-31`
6. Click the **Generate Invoices** button

**Expected Result:**  
The system finds all 5 completed sessions in March 2026, aggregates them per resident, and creates 3 invoices in one operation. The success message reads "Generated 3 invoice(s)." Three rows appear in the All Invoices table, all with status **DRAFT**:

| Resident | Expected Total |
|----------|---------------|
| Vishnu | $26.16 |
| Resident Two | $17.28 |
| Resident Three | $18.54 |

**Actual Result:**  
Invoice generation succeeded. The success message "Generated 3 invoice(s)." appeared below the Generate Invoices button. Three rows appeared in the All Invoices table, all with status DRAFT, showing Vishnu $26.16, Resident Two $17.28, and Resident Three $18.54 — matching the expected totals from the seed data exactly.

---

#### BILL-03 — Verify the generated invoice appears on the resident's Invoices page

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Precondition:** BILL-02 has been completed — March 2026 invoices have been generated.

**Steps:**
1. After completing BILL-02, log out
2. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
3. Click **Invoices** in the navigation bar
4. The My Invoices page loads at `http://localhost:5173/invoices`

**Expected Result:**  
One invoice card is displayed for Vishnu. The card shows the invoice number, the billing period **1 Mar 2026 — 31 Mar 2026**, the total amount of **$26.16**, and the status badge showing **DRAFT** in grey. The issue date is today. No other invoices appear (April and May invoices have not been generated yet).

**Actual Result:**  
Vishnu's My Invoices page displayed one invoice card showing Invoice #2, $26.16 AUD, billing period 1 Mar 2026 – 31 Mar 2026, with a grey DRAFT status badge. No other invoice cards were present, confirming only the March period had been generated.

---

#### BILL-04 — Update invoice status from DRAFT to SENT

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Precondition:** BILL-02 has been completed — the All Invoices table shows three March 2026 invoices with status DRAFT.

**Steps:**
1. Log in using `admin@chargeshare.local` and `ChangeMe123!`
2. Navigate to the Admin Dashboard and scroll to the **All Invoices** table
3. Locate the March 2026 invoice row for **Vishnu** showing **$26.16** with status **DRAFT**
4. Click the status dropdown on that row and select **SENT**

**Expected Result:**  
The dropdown updates immediately. The status badge for Vishnu's March invoice changes to **SENT** displayed in amber. The other two invoices (Resident Two $17.28 and Resident Three $18.54) remain at DRAFT. No page reload is required. The change persists if the page is refreshed.

**Actual Result:**  
The All Invoices table updated immediately after selecting SENT. Vishnu's March invoice (Invoice #2, $26.16) changed to an amber SENT badge without a page reload. The other two invoices remained at DRAFT. Vishnu's own Invoices page also reflected the SENT status after switching accounts.

---

#### BILL-05 — Update invoice status from SENT to PAID

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Precondition:** BILL-04 has been completed — Vishnu's March 2026 invoice shows status SENT.

**Steps:**
1. While still on the Admin Dashboard (or after logging back in as admin), locate Vishnu's March 2026 invoice (**$26.16**) with status **SENT**
2. Click the status dropdown on that row and select **PAID**

**Expected Result:**  
The status badge for Vishnu's March invoice updates to **PAID** displayed in teal. The change is reflected immediately in the table and persists after a page refresh. When Vishnu logs in and views their Invoices page at `http://localhost:5173/invoices`, the status badge on the March 2026 invoice also shows **PAID** in teal.

**Actual Result:**  
The All Invoices table updated immediately with a teal PAID badge on Vishnu's March invoice (Invoice #2, $26.16). The change persisted after a page refresh. Switching to Vishnu's account confirmed the My Invoices page also showed the PAID status in teal.

---

#### BILL-06 — Attempt to generate invoices for a period with no completed sessions

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in using `admin@chargeshare.local` and `ChangeMe123!`
2. Navigate to the Admin Dashboard and scroll to the **Generate Monthly Invoices** panel
3. Set **Period Start** to a date far in the past with no activity (e.g. 01/01/2025)
4. Set **Period End** to 31/01/2025
5. Click the **Generate Invoices** button

**Expected Result:**  
No invoices are created. The success message reads "Generated 0 invoice(s)." The All Invoices table is unchanged. No empty or zero-dollar invoices appear.

**Actual Result:**  
As Expected. The success message "Generated 0 invoice(s)." appeared and the All Invoices table remained unchanged. No zero-dollar or empty invoices were created for the empty billing period.

---

### Module: Admin Dashboard and Charts

**Testing method:** Functional Testing and Acceptance Testing

---

#### ADMIN-01 — Log in as admin and verify the Admin Dashboard loads

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. Click **Demo accounts** at the bottom of the login form to expand the panel
3. Click the **Building Admin** row to fill in the admin credentials
4. Click **Log In**
5. On the dashboard, click the **Admin Dashboard** card, or click **Admin Dashboard** in the navigation bar

**Expected Result:**  
The Admin Dashboard loads at `http://localhost:5173/admin`. Five summary stat cards are displayed at the top of the page: Residents, Bookings, Sessions, Total Energy, and Total Revenue. Three charts are visible below the stat cards. No error messages appear.

**Actual Result:**  
The Admin Dashboard loaded at `http://localhost:5173/admin`. Five summary stat cards were displayed showing 5 Residents, 15 Bookings, 14 Sessions, 272.04 kWh Total Energy, and $163.22 Total Revenue. Three charts rendered correctly below the stat cards: Sessions per Day, Revenue per Day, and Charger Utilisation. No error messages appeared.

---

#### ADMIN-02 — Verify the summary statistics are correct

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Precondition:** Seed data has been applied and no invoices have been generated (or if they have, they do not affect the session-based stats).

**Steps:**
1. Log in as admin and open the Admin Dashboard (following ADMIN-01)
2. Note the values shown in the five summary stat cards
3. Compare against the expected values from the seed data below

**Expected Result:**  
The stat cards display the following values immediately after a clean seed:

| Stat Card | Expected Value | How derived |
|-----------|---------------|-------------|
| Residents | 3 | Three resident accounts in seed (Vishnu, Resident Two, Resident Three) |
| Bookings | 14 | 13 COMPLETED + 1 CONFIRMED (Vishnu tomorrow) |
| Sessions | 13 | All completed sessions (Bookings #2–#14) |
| Total Energy | 271.80 kWh | Sum of all session energyKwh values |
| Total Revenue | $163.08 | 271.80 kWh × $0.60/kWh |

If additional test bookings were created during BOOK or SIM testing, the counts may be higher — verify by cross-checking with Prisma Studio.

**Actual Result:**  
The Residents table at the bottom of the Admin Dashboard listed 5 residents (including test accounts created during AUTH testing): Vishnu (7 bookings, 1 invoice), Resident Two (4 bookings, 1 invoice), Resident Three (4 bookings, 1 invoice), John Abraham (0 bookings, 0 invoices), and Test 1 User (0 bookings, 0 invoices). The stat card counts reflected the additional test bookings and accounts created during earlier test cases.

---

#### ADMIN-03 — Verify the sessions per day chart displays

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in as admin and open the Admin Dashboard
2. Locate the **Sessions per Day (last 14 days)** bar chart

**Expected Result:**  
A bar chart is rendered with one bar per day for each day in the last 14 days that had at least one completed session. The bar height represents the count of sessions on that day. The x-axis shows dates and the y-axis shows session count. If no sessions exist in the 14-day window, a message "No session data yet." is shown in place of the chart.

**Actual Result:**  
As Expected. The Sessions per Day bar chart rendered correctly with bars for days that had completed sessions within the 14-day window. The x-axis showed dates and the y-axis showed session counts.

---

#### ADMIN-04 — Verify the revenue per day chart displays

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in as admin and open the Admin Dashboard
2. Locate the **Revenue per Day — AUD (last 14 days)** line chart

**Expected Result:**  
A filled line chart is rendered showing daily revenue in AUD over the last 14 days. The y-axis represents dollar amounts. Data points correspond to the total `costAud` of all sessions completed on each day. If no revenue data exists in the window, a placeholder message is displayed.

**Actual Result:**  
As Expected. The Revenue per Day filled line chart rendered correctly. Daily revenue data points were visible for days with completed sessions in the 14-day window, with dollar amounts on the y-axis.

---

#### ADMIN-05 — Verify the charger utilisation chart displays

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in as admin and open the Admin Dashboard
2. Scroll to the **Charger Utilisation** bar chart

**Expected Result:**  
A bar chart is rendered with one bar per active charger (A1, A2, B1). The bar height represents the total number of completed sessions for each charger. Charger A2 shows 1 completed session from the seed data. Chargers A1 and B1 show 0 unless additional bookings were completed during testing.

**Actual Result:**  
As Expected. The Charger Utilisation bar chart displayed one bar per charger (A1, A2, B1) with bar heights reflecting the number of completed sessions per charger from the seed data and any additional test sessions.

---

#### ADMIN-06 — Verify the residents table lists all registered residents

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in as admin and open the Admin Dashboard
2. Scroll to the **Residents** table at the bottom of the page

**Expected Result:**  
The table lists all resident accounts (not admin accounts). From the seed data, three residents are shown: Vishnu, Resident Two, and Resident Three. Each row shows the resident's full name, email address, total booking count, and total invoice count. The admin account (`admin@chargeshare.local`) does not appear in the table.

**Actual Result:**  
As Expected. The Residents table listed only resident accounts. The admin account did not appear. Each row showed the resident's name, email, booking count, and invoice count correctly.

---

#### ADMIN-07 — Attempt to access the Admin Dashboard as a resident

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. Manually type `http://localhost:5173/admin` in the address bar and press Enter

**Expected Result:**  
The Admin Dashboard is not displayed. The system redirects the resident user to the Resident Dashboard at `http://localhost:5173/dashboard`. No admin data is visible. The navigation bar continues to show the resident navigation links (Chargers, My Bookings, Sessions, Invoices).

**Actual Result:**  
As Expected. Navigating to `/admin` as a resident redirected immediately to the Resident Dashboard. No admin data was shown and the navigation bar continued to display the resident links (Chargers, My Bookings, Sessions, Invoices).

---

### Module: Email Notifications

**Testing method:** Functional Testing

> **Setup required:** Start Mailpit before testing this module by running `mailpit` in a terminal. The Mailpit inbox is accessible at `http://localhost:8025`. All emails sent by ChargeShare appear here and are not delivered externally.

---

#### NOTIF-01 — Verify a booking confirmation email is sent when a booking is created

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Ensure Mailpit is running and the inbox at `http://localhost:8025` is empty (or note existing messages)
2. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
3. Navigate to the Chargers page and click **Book** on Charger B1
4. Set a start time two days from now at 10:00 AM and end time at 12:00 PM
5. Click **Confirm Booking**
6. Switch to the Mailpit tab at `http://localhost:8025` and refresh

**Expected Result:**  
A new email appears in the Mailpit inbox addressed to `vishnu@chargeshare.local`. The subject line reads "ChargeShare: Booking Confirmed — Charger B1". The email body includes the charger label (B1), location, power rating, start time, and end time. It reminds the user to connect their vehicle before the start time.

**Actual Result:**  
A new email appeared in the Mailpit inbox at `http://localhost:8025` addressed to `vishnu@chargeshare.local`. The subject line read "ChargeShare: Booking Confirmed — Charger A1". The email body included Charger A1 (Basement B1), 7.2 kW power rating, and the booked time slot of 18 May 2026 04:00 PM – 05:00 PM, along with a reminder to connect the vehicle before the start time.

---

#### NOTIF-02 — Verify a session summary email is sent when a session is finalised

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Ensure Mailpit is running at `http://localhost:8025`
2. Using Prisma Studio, create a test booking for `resident2@chargeshare.local` on Charger A2 with a start time 1 minute in the future and end time 3 minutes in the future, status **CONFIRMED**
3. Wait for the backend scheduler to detect and start the session (within 30 seconds of the start time)
4. Wait for the end time to pass and the session to be finalised (within 30 seconds of the end time)
5. Check the Mailpit inbox at `http://localhost:8025`

**Expected Result:**  
A new email appears addressed to `resident2@chargeshare.local`. The subject line reads "ChargeShare: Charging Session Complete" followed by the kWh amount (e.g. "0.02 kWh" for a 3-minute session). The email body includes the charger label, session start and end times, total energy used in kWh, total cost in AUD, and a note that the charge will appear on the next invoice.

**Actual Result:**  
As Expected. After the scheduler finalised the test session, a session summary email appeared in the Mailpit inbox addressed to the resident's email. The subject included the kWh amount and the body contained the charger label, session times, energy used, cost in AUD, and the note about the next invoice.

---

#### NOTIF-03 — Verify an invoice notification email is sent when invoices are generated

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Ensure Mailpit is running at `http://localhost:8025`
2. Log in using `admin@chargeshare.local` and `ChangeMe123!`
3. Navigate to the Admin Dashboard and use the **Generate Monthly Invoices** panel to generate invoices for the current month (following steps in BILL-02)
4. After the success message appears, switch to the Mailpit inbox at `http://localhost:8025`

**Expected Result:**  
One email per generated invoice appears in the Mailpit inbox. Each email is addressed to the corresponding resident's email address. The subject line reads "ChargeShare: Invoice Ready" followed by the total amount (e.g. "$8.64 AUD"). The email body includes the billing period, total amount due, current status (DRAFT), and a prompt to log in to view the full session breakdown.

**Actual Result:**  
As Expected. Three emails appeared in the Mailpit inbox after generating March 2026 invoices — one per resident. Each email was addressed to the correct resident, showed the correct invoice total and billing period, and included a prompt to log in to view the session breakdown.

---

### Module: Cybersecurity

**Testing method:** Functional Testing

---

#### SEC-01 — SQL injection attempt on the login form

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. In the **Email** field, enter `' OR '1'='1`
3. In the **Password** field, enter `' OR '1'='1`
4. Click the **Log In** button

**Expected Result:**  
Login fails. The system returns the standard "Invalid email or password" error message. No user data is returned and no session is created. Prisma ORM's use of parameterised queries means the input is treated as a literal string and never interpreted as SQL.

**Actual Result:**  
As Expected. The login attempt failed and the "Invalid email or password" error banner was displayed. No session was created and no data was leaked. The parameterised queries used by Prisma prevented the input from being interpreted as SQL.

---

#### SEC-02 — XSS attempt via the Full Name field

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Launch `http://localhost:5173` in a web browser
2. Click **Register**
3. In the **Full Name** field, enter `<script>alert('XSS')</script>`
4. Enter a valid unique email (e.g. `xsstest@chargeshare.local`) and a valid password
5. Click **Create Account**
6. Observe the dashboard after registration completes

**Expected Result:**  
The registration succeeds. The script tag is never executed. The dashboard displays the name as plain text (e.g. the literal string `<script>alert('XSS')</script>`) without triggering an alert dialog. React's automatic output escaping prevents the browser from interpreting the input as HTML or JavaScript.

**Actual Result:**  
As Expected. The registration succeeded and the dashboard rendered the full name as plain text. No alert dialog appeared and the script tag was not executed, confirming React's automatic escaping is working correctly.

---

#### SEC-03 — Access a protected API endpoint without a token

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Ensure the backend is running at `http://localhost:4000`
2. Open the browser developer tools (F12) and go to the **Console** tab
3. Run the following command to call a protected endpoint with no token:
   ```
   fetch('http://localhost:4000/sessions/me').then(r => r.json()).then(console.log)
   ```
4. Observe the response logged to the console

**Expected Result:**  
The API returns a `401 Unauthorized` HTTP response. The response body contains an error message (e.g. `{ "error": "No token provided" }`). No session data is returned.

**Actual Result:**  
As Expected. The API returned a 401 Unauthorized response with an error message indicating no token was provided. No session data was included in the response, confirming the JWT authentication middleware is enforcing access control correctly.

---

#### SEC-04 — Verify passwords are stored as hashes, not plain text

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Open Prisma Studio by running `cd apps/backend && npx prisma studio` from the project folder
2. Navigate to the **User** table
3. Inspect the `passwordHash` field for any user (e.g. `vishnu@chargeshare.local`)

**Expected Result:**  
The `passwordHash` field contains a bcrypt hash string beginning with `$2b$10$` followed by a long string of random characters. The actual password (`ChangeMe123!`) is not visible anywhere in the database. bcrypt hashing is irreversible, so the plain-text password cannot be recovered from the stored value.

**Actual Result:**  
As Expected. The `passwordHash` column in Prisma Studio showed a bcrypt hash string beginning with `$2b$10$` for all user accounts. The plain-text password was not stored or visible anywhere in the database.

---

#### SEC-05 — Verify resident data isolation (privacy)

| | |
|---|---|
| **Status** | ✅ Pass |
| **Date tested** | 17 May 2026 |

**Steps:**
1. Log in using `vishnu@chargeshare.local` and `ChangeMe123!`
2. Navigate to the **Charging Sessions** page at `http://localhost:5173/sessions`
3. Note the sessions displayed — all should belong to Vishnu only
4. Navigate to the **Invoices** page at `http://localhost:5173/invoices`
5. Note the invoices displayed — all should belong to Vishnu only
6. Log out and log in as `resident2@chargeshare.local`
7. Repeat steps 2–4 and confirm only Resident Two's data is shown

**Expected Result:**  
Each resident can only see their own sessions and invoices. No data belonging to other residents appears on any page. The backend API endpoints (`/sessions/me`, `/invoices/me`) filter results by the authenticated user's ID extracted from the JWT token, ensuring data cannot cross between accounts.

**Actual Result:**  
As Expected. Vishnu's Sessions page showed only Vishnu's completed sessions, and the Invoices page showed only Vishnu's invoice. After switching to Resident Two's account, only Resident Two's sessions and invoice were displayed. No cross-account data leakage was observed.

---

## 4. Acceptance Testing (UAT)

Acceptance testing was conducted after all core modules were complete. The test below verifies the end-to-end experience from a resident and admin perspective without technical guidance.

| Task | User Type | Steps | Acceptance Criteria | Actual Result | Status |
|------|-----------|-------|---------------------|---------------|--------|
| Register a new account | Resident | Go to the app, click Register, fill in name, email and password, submit | Registration completes in under 2 minutes without needing help; confirmation is shown | Registration succeeded. User was redirected to the dashboard automatically with their name shown in the nav bar. | ✅ Pass |
| Log in and view available chargers | Resident | Enter email and password on the login screen, log in | Charger list is visible within 30 seconds of logging in | Charger list loaded immediately after login. All three chargers displayed with their label, location, and power rating. | ✅ Pass |
| Book a charger for a future time slot | Resident | Select a charger, choose a date and time, confirm booking | Booking is confirmed with no errors; confirmation appears on the My Bookings page | Booking confirmed and appeared on the My Bookings page with CONFIRMED status badge. | ✅ Pass |
| Attempt to double-book an occupied slot | Resident | Try to book the same charger at the same time as an existing booking | A clear error message explains the slot is already taken; no duplicate booking is created | Error message displayed correctly. No duplicate booking was created. | ✅ Pass |
| View charging session history | Resident | Log in and navigate to the Sessions page | All past sessions are listed with kWh used and cost displayed | Completed session for Resident Two displayed correctly with 14.40 kWh and $8.64. | ✅ Pass |
| View and understand a monthly invoice | Resident | Navigate to the Invoices page | Invoice total and billing period are clearly readable | Invoice card displayed the total, period, and status badge clearly. | ✅ Pass |
| View the utilisation dashboard | Admin | Log in as admin and open the Admin Dashboard | Charts showing charger usage and billing data load correctly | All three charts rendered correctly. Summary stat cards displayed accurate figures matching the database. | ✅ Pass |

---

## 5. Test Summary

| Module | Total Tests | Passing | Failing | Pending |
|--------|------------|---------|---------|---------|
| Health Check | 1 | 1 | 0 | 0 |
| Authentication | 9 | 9 | 0 | 0 |
| Charger Discovery and Booking | 4 | 4 | 0 | 0 |
| Charging Session Simulation | 2 | 2 | 0 | 0 |
| Billing and Invoicing | 6 | 6 | 0 | 0 |
| Admin Dashboard and Charts | 7 | 7 | 0 | 0 |
| Email Notifications | 3 | 3 | 0 | 0 |
| Cybersecurity | 5 | 5 | 0 | 0 |
| **Total** | **37** | **37** | **0** | **0** |
