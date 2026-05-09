import prisma from "./db.js";
import logger from "./logger.js";

const TARIFF_PER_KWH = 0.60;
const TICK_MS = 30_000;

async function tick() {
  const now = new Date();

  // Start sessions for confirmed bookings whose start time has passed and have no session yet
  const toStart = await prisma.booking.findMany({
    where: { status: "CONFIRMED", startAt: { lte: now }, session: null },
    include: { charger: true },
  });
  for (const booking of toStart) {
    await prisma.session.create({
      data: { bookingId: booking.id, startedAt: booking.startAt, energyKwh: 0, costAud: 0 },
    });
    logger.info({ bookingId: booking.id }, "Scheduler: session started");
  }

  // Finalize sessions whose booking end time has passed
  const toFinalize = await prisma.session.findMany({
    where: { endedAt: null, booking: { endAt: { lte: now } } },
    include: { booking: { include: { charger: true } } },
  });
  for (const session of toFinalize) {
    const durationHours = (session.booking.endAt - session.startedAt) / 3_600_000;
    const energyKwh = parseFloat((session.booking.charger.powerKw * durationHours).toFixed(2));
    const costAud = parseFloat((energyKwh * TARIFF_PER_KWH).toFixed(2));
    await prisma.$transaction([
      prisma.session.update({ where: { id: session.id }, data: { endedAt: session.booking.endAt, energyKwh, costAud } }),
      prisma.booking.update({ where: { id: session.booking.id }, data: { status: "COMPLETED" } }),
    ]);
    logger.info({ sessionId: session.id, energyKwh, costAud }, "Scheduler: session finalized");
  }

  // Update energy reading for sessions currently in progress
  const active = await prisma.session.findMany({
    where: { endedAt: null, booking: { endAt: { gt: now } } },
    include: { booking: { include: { charger: true } } },
  });
  for (const session of active) {
    const durationHours = (now - session.startedAt) / 3_600_000;
    const energyKwh = parseFloat((session.booking.charger.powerKw * durationHours).toFixed(2));
    const costAud = parseFloat((energyKwh * TARIFF_PER_KWH).toFixed(2));
    await prisma.session.update({ where: { id: session.id }, data: { energyKwh, costAud } });
  }
}

export function startScheduler() {
  tick().catch((e) => logger.error(e, "Scheduler tick error"));
  setInterval(() => tick().catch((e) => logger.error(e, "Scheduler tick error")), TICK_MS);
  logger.info({ tickMs: TICK_MS }, "Scheduler started");
}
