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

  const admin = await prisma.user.upsert({
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
  console.log(`  Admin    : ${admin.email}`);

  for (const r of [
    { fullName: "Vishnu", email: "vishnu@chargeshare.local" },
    { fullName: "Resident Two", email: "resident2@chargeshare.local" },
    { fullName: "Resident Three", email: "resident3@chargeshare.local" },
  ]) {
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

  console.log("\n  All accounts use password: ChangeMe123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
