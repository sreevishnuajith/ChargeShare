import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const SEED_PASSWORD = "ChangeMe123!";
const TARIFF = 0.60; // $0.60 per kWh

// Return a local Date for a fixed calendar date and time
function dt(year, month, day, hour, minute = 0) {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

// Calculate session energy and cost from charger power and duration
function calc(powerKw, startDate, endDate) {
  const durationHours = (endDate - startDate) / 3_600_000;
  const energyKwh = parseFloat((powerKw * durationHours).toFixed(2));
  const costAud = parseFloat((energyKwh * TARIFF).toFixed(2));
  return { energyKwh, costAud };
}

async function main() {
  const hash = await bcrypt.hash(SEED_PASSWORD, 10);

  // ── Stable entities: building, users, chargers ────────────────────
  const building = await prisma.building.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "ChargeShare Demo Building", address: "100 Example St, Sydney NSW" },
  });
  console.log(`  Building : ${building.name}`);

  await prisma.user.upsert({
    where: { email: "admin@chargeshare.local" },
    update: {},
    create: { fullName: "Building Admin", email: "admin@chargeshare.local", passwordHash: hash, role: "ADMIN", buildingId: building.id },
  });
  console.log(`  Admin    : admin@chargeshare.local`);

  const residentDefs = [
    { fullName: "Vishnu",         email: "vishnu@chargeshare.local"    },
    { fullName: "Resident Two",   email: "resident2@chargeshare.local" },
    { fullName: "Resident Three", email: "resident3@chargeshare.local" },
  ];
  const residentUsers = [];
  for (const r of residentDefs) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: { fullName: r.fullName, email: r.email, passwordHash: hash, role: "RESIDENT", buildingId: building.id },
    });
    residentUsers.push(user);
    console.log(`  Resident : ${user.email}`);
  }

  const CHARGERS = [
    { id: 1, label: "A1", location: "Basement B1", powerKw: 7.2  },
    { id: 2, label: "A2", location: "Basement B1", powerKw: 7.2  },
    { id: 3, label: "B1", location: "Basement B2", powerKw: 11.0 },
  ];
  for (const c of CHARGERS) {
    await prisma.charger.upsert({
      where: { id: c.id },
      update: {},
      create: { label: c.label, location: c.location, powerKw: c.powerKw, isActive: true, buildingId: building.id },
    });
    console.log(`  Charger  : ${c.label} (${c.powerKw} kW @ ${c.location})`);
  }

  const [vishnu, resident2, resident3] = residentUsers;
  // charger IDs: A1=1, A2=2, B1=3

  // ── Reset transactional data for clean re-runs ────────────────────
  // Delete in dependency order: invoices → sessions → bookings
  await prisma.invoice.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.booking.deleteMany({});
  console.log("\n  Cleared existing bookings, sessions and invoices.");

  // ── Helper: create a COMPLETED booking + session in one step ──────
  async function completedSession(id, userId, chargerId, start, end) {
    const charger = CHARGERS.find((c) => c.id === chargerId);
    const { energyKwh, costAud } = calc(charger.powerKw, start, end);
    await prisma.booking.create({ data: { id, userId, chargerId, startAt: start, endAt: end, status: "COMPLETED" } });
    await prisma.session.create({ data: { bookingId: id, startedAt: start, endedAt: end, energyKwh, costAud } });
    return { energyKwh, costAud };
  }

  // ── Booking #1: upcoming CONFIRMED (for booking flow tests) ───────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(10, 0, 0, 0);
  await prisma.booking.create({ data: { id: 1, userId: vishnu.id, chargerId: 1, startAt: tomorrow, endAt: tomorrowEnd, status: "CONFIRMED" } });
  console.log(`\n  Booking  : #1  Vishnu → A1  tomorrow 08:00–10:00              CONFIRMED`);

  // ── March 2026 sessions ───────────────────────────────────────────
  console.log("\n  ── March 2026 ──────────────────────────────────────────");

  let r = await completedSession(2, vishnu.id,    1, dt(2026,3,5,8),    dt(2026,3,5,11)    );
  console.log(`  Booking  : #2  Vishnu      → A1  5 Mar 08:00–11:00   ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(3, vishnu.id,    3, dt(2026,3,12,14),  dt(2026,3,12,16)   );
  console.log(`  Booking  : #3  Vishnu      → B1  12 Mar 14:00–16:00  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(4, resident2.id, 2, dt(2026,3,8,9),    dt(2026,3,8,13)    );
  console.log(`  Booking  : #4  Res Two     → A2  8 Mar 09:00–13:00   ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(5, resident3.id, 3, dt(2026,3,20,10),  dt(2026,3,20,11,30));
  console.log(`  Booking  : #5  Res Three   → B1  20 Mar 10:00–11:30  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(6, resident3.id, 1, dt(2026,3,25,7),   dt(2026,3,25,9)    );
  console.log(`  Booking  : #6  Res Three   → A1  25 Mar 07:00–09:00  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  // ── April 2026 sessions ───────────────────────────────────────────
  console.log("\n  ── April 2026 ──────────────────────────────────────────");

  r = await completedSession(7, vishnu.id,    1, dt(2026,4,3,8),    dt(2026,4,3,10)    );
  console.log(`  Booking  : #7  Vishnu      → A1  3 Apr 08:00–10:00   ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(8, vishnu.id,    3, dt(2026,4,15,13),  dt(2026,4,15,16)   );
  console.log(`  Booking  : #8  Vishnu      → B1  15 Apr 13:00–16:00  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(9, resident2.id, 2, dt(2026,4,7,9),    dt(2026,4,7,11)    );
  console.log(`  Booking  : #9  Res Two     → A2  7 Apr 09:00–11:00   ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(10, resident2.id, 2, dt(2026,4,22,14), dt(2026,4,22,17)   );
  console.log(`  Booking  : #10 Res Two     → A2  22 Apr 14:00–17:00  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(11, resident3.id, 1, dt(2026,4,10,7),  dt(2026,4,10,11)   );
  console.log(`  Booking  : #11 Res Three   → A1  10 Apr 07:00–11:00  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  // ── May 2026 sessions ─────────────────────────────────────────────
  console.log("\n  ── May 2026 ────────────────────────────────────────────");

  r = await completedSession(12, vishnu.id,    3, dt(2026,5,10,9),  dt(2026,5,10,11,30));
  console.log(`  Booking  : #12 Vishnu      → B1  10 May 09:00–11:30  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  r = await completedSession(13, resident3.id, 2, dt(2026,5,13,14), dt(2026,5,13,16)   );
  console.log(`  Booking  : #13 Res Three   → A2  13 May 14:00–16:00  ${r.energyKwh.toFixed(2)} kWh  $${r.costAud.toFixed(2)}`);

  // Yesterday: dynamic date so SIM-01 always shows a recent session
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(9, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(11, 0, 0, 0);
  const { energyKwh: yKwh, costAud: yCost } = calc(7.2, yesterday, yesterdayEnd);
  await prisma.booking.create({ data: { id: 14, userId: resident2.id, chargerId: 2, startAt: yesterday, endAt: yesterdayEnd, status: "COMPLETED" } });
  await prisma.session.create({ data: { bookingId: 14, startedAt: yesterday, endedAt: yesterdayEnd, energyKwh: yKwh, costAud: yCost } });
  console.log(`  Booking  : #14 Res Two     → A2  yesterday 09:00–11:00  ${yKwh.toFixed(2)} kWh  $${yCost.toFixed(2)}`);

  // ── Billing summary ───────────────────────────────────────────────
  console.log(`
  ════════════════════════════════════════════════════════════
  Billing summary — expected invoice totals per period:

  Period              Vishnu     Resident Two   Resident Three
  March 2026         $26.16        $17.28          $18.54
  April 2026         $28.44        $21.60          $17.28
  May 2026 (to date) $16.50         $8.64           $8.64

  Tariff: $0.60 / kWh
  No invoices are pre-seeded — generate them via Admin Dashboard.
  ════════════════════════════════════════════════════════════

  All accounts use password: ChangeMe123!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
