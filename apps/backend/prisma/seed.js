import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const SEED_PASSWORD = "ChangeMe123!";

async function main() {
  const hash = await bcrypt.hash(SEED_PASSWORD, 10);

  const building = await prisma.building.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "ChargeShare Demo Building",
      address: "100 Example St, Sydney NSW",
    },
  });
  console.log(`  Building : ${building.name}`);

  await prisma.user.upsert({
    where: { email: "admin@chargeshare.local" },
    update: {},
    create: {
      fullName: "Building Admin",
      email: "admin@chargeshare.local",
      passwordHash: hash,
      role: "ADMIN",
      buildingId: building.id,
    },
  });
  console.log(`  Admin    : admin@chargeshare.local`);

  const residentDefs = [
    { fullName: "Vishnu", email: "vishnu@chargeshare.local" },
    { fullName: "Resident Two", email: "resident2@chargeshare.local" },
    { fullName: "Resident Three", email: "resident3@chargeshare.local" },
  ];

  const residentUsers = [];
  for (const r of residentDefs) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: {
        fullName: r.fullName,
        email: r.email,
        passwordHash: hash,
        role: "RESIDENT",
        buildingId: building.id,
      },
    });
    residentUsers.push(user);
    console.log(`  Resident : ${user.email}`);
  }

  for (const c of [
    { id: 1, label: "A1", location: "Basement B1", powerKw: 7.2 },
    { id: 2, label: "A2", location: "Basement B1", powerKw: 7.2 },
    { id: 3, label: "B1", location: "Basement B2", powerKw: 11.0 },
  ]) {
    const charger = await prisma.charger.upsert({
      where: { id: c.id },
      update: {},
      create: {
        label: c.label,
        location: c.location,
        powerKw: c.powerKw,
        isActive: true,
        buildingId: building.id,
      },
    });
    console.log(`  Charger  : ${charger.label} (${charger.powerKw} kW @ ${charger.location})`);
  }

  // Sample data per Section 7 of database-spec.md
  const vishnu = residentUsers[0];
  const resident2 = residentUsers[1];

  // Booking 1: Vishnu books Charger A1 tomorrow 8am–10am (CONFIRMED)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(10, 0, 0, 0);

  const booking1 = await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: vishnu.id,
      chargerId: 1,
      startAt: tomorrow,
      endAt: tomorrowEnd,
      status: "CONFIRMED",
    },
  });
  console.log(`  Booking  : #${booking1.id} Vishnu → Charger A1 tomorrow 08:00–10:00 (CONFIRMED)`);

  // Booking 2: Resident Two booked Charger A2 yesterday 9am–11am (COMPLETED)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(9, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(11, 0, 0, 0);

  const booking2 = await prisma.booking.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      userId: resident2.id,
      chargerId: 2,
      startAt: yesterday,
      endAt: yesterdayEnd,
      status: "COMPLETED",
    },
  });
  console.log(`  Booking  : #${booking2.id} Resident Two → Charger A2 yesterday 09:00–11:00 (COMPLETED)`);

  // Session for Booking 2: 7.2 kW × 2 h = 14.4 kWh at $0.60/kWh = $8.64
  await prisma.session.upsert({
    where: { bookingId: booking2.id },
    update: {},
    create: {
      bookingId: booking2.id,
      startedAt: yesterday,
      endedAt: yesterdayEnd,
      energyKwh: 14.4,
      costAud: 8.64,
    },
  });
  console.log(`  Session  : Booking #${booking2.id} → 14.4 kWh · $8.64`);

  // Invoice for Resident Two: current calendar month, $8.64, DRAFT
  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);
  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  periodEnd.setDate(0);
  periodEnd.setHours(23, 59, 59, 999);

  await prisma.invoice.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: resident2.id,
      periodStart,
      periodEnd,
      totalAud: 8.64,
      status: "DRAFT",
    },
  });
  console.log(`  Invoice  : #1 Resident Two · May 2026 · $8.64 (DRAFT)`);

  console.log("\n  All accounts use password: ChangeMe123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
