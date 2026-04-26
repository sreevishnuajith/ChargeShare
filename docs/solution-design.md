# ChargeShare Solution Design (Phase 1)

## 1. Problem Statement

In shared parking environments (apartments/workplaces), EV users compete for limited charging points. This causes booking conflicts, unfair electricity billing, and no reliable visibility for managers.

## 2. Scope

### In Scope (Prototype)

- User registration/login
- Charger availability listing
- Charger booking and conflict prevention
- Simulated charging sessions (kWh and duration)
- Cost calculation and invoice generation
- Admin dashboard with utilisation and billing insights
- Development email notifications for confirmations and invoices

### Out of Scope (Phase 1 Prototype)

- Real charger hardware integration
- Real payment processing
- Production cloud deployment

## 3. Success Criteria

The solution is successful if it can:

- Prevent double-booking and overlapping reservations
- Accurately calculate cost from simulated energy usage
- Generate monthly invoice records per user
- Show admin visualisations for utilisation and billing
- Demonstrate secure authentication and role-based access

## 4. Stakeholders and User Roles

- Resident (EV user): books chargers and views invoices
- Building Administrator: monitors usage, billing, and system health
- Project owner/developer: maintains data model, logic, and testing

## 5. Functional Requirements

- FR1: User authentication with secure password storage
- FR2: View charger status and available timeslots
- FR3: Create/cancel bookings with overlap checks
- FR4: Simulate charging sessions tied to bookings
- FR5: Calculate per-session and per-period costs
- FR6: Generate invoice records by month
- FR7: Provide admin dashboard charts and summaries
- FR8: Send notification emails for booking and invoices

## 6. Non-Functional Requirements

- Security: JWT auth, hashed passwords, protected endpoints
- Reliability: data consistency for bookings, sessions, invoices
- Usability: responsive, clear workflows for residents/admins
- Maintainability: modular backend/frontend/data-layer separation
- Performance: acceptable response under class-demo load

## 7. High-Level Architecture

Three-tier architecture:

1. Presentation Layer (`apps/frontend`)
   - React + Vite + Tailwind UI
   - Resident and Admin workflows
2. Application Layer (`apps/backend`)
   - Express REST APIs
   - Auth, booking rules, billing logic, notifications
3. Data Layer (`apps/backend/prisma`)
   - SQLite via Prisma ORM
   - Relational schema for users, chargers, bookings, sessions, invoices

## 8. Technical Design

### Frontend

- Routing: Resident and Admin views
- State/data: API calls through `fetch`/`axios`
- Charts: Chart.js for utilisation and billing trends
- Validation: form-level checks for required fields and date-time logic

### Backend

- API style: REST with JSON payloads
- Security middleware: CORS, Helmet, JWT validation
- Business rules:
  - deny booking when overlap exists
  - deny booking for unavailable charger
  - compute cost from `energyKwh * tariffRate`
- Background processing: scheduler for session simulation and invoice periods

### Data Model (Core Entities)

- Building (1) -> (many) User
- Building (1) -> (many) Charger
- User (1) -> (many) Booking
- Charger (1) -> (many) Booking
- Booking (1) -> (0..1) Session
- User (1) -> (many) Invoice

## 9. API Surface (Initial)

- `POST /auth/register`
- `POST /auth/login`
- `GET /chargers`
- `POST /bookings`
- `GET /bookings/me`
- `GET /sessions/me`
- `GET /invoices/me`
- `GET /admin/dashboard`

## 10. Risks and Controls

- SQL injection: mitigated by Prisma parameterisation
- XSS: React output escaping + input validation
- Credential compromise: password hashing + strong JWT secret
- Booking race conditions: overlap checks and transaction-safe writes
- Privacy leak: role-based endpoint access and limited data exposure

## 11. Implementation Phases

1. Setup and architecture baseline (this phase)
2. Authentication + role model
3. Charger and booking module
4. Session simulation module
5. Billing and invoice module
6. Admin analytics and notifications
7. Testing, hardening, and presentation assets
