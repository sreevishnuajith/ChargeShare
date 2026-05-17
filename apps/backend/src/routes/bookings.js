import express from "express";
import { z } from "zod";
import prisma from "../db.js";
import { authenticate } from "../middleware/authenticate.js";
import { sendBookingConfirmation } from "../mailer.js";

const router = express.Router();

const createSchema = z.object({
  chargerId: z.number().int().positive(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
});

router.get("/me", authenticate, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.sub },
    include: {
      charger: { select: { label: true, location: true, powerKw: true } },
      session: { select: { energyKwh: true, costAud: true } },
    },
    orderBy: { startAt: "desc" },
  });
  res.json(bookings);
});

router.post("/", authenticate, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { chargerId, startAt: startStr, endAt: endStr } = parsed.data;
  const startAt = new Date(startStr);
  const endAt = new Date(endStr);

  if (startAt >= endAt) {
    return res.status(400).json({ error: "startAt must be before endAt" });
  }
  if (startAt < new Date()) {
    return res.status(400).json({ error: "Cannot book a time slot in the past" });
  }

  const charger = await prisma.charger.findUnique({ where: { id: chargerId } });
  if (!charger || !charger.isActive) {
    return res.status(404).json({ error: "Charger not found" });
  }

  const overlap = await prisma.booking.findFirst({
    where: {
      chargerId,
      status: "CONFIRMED",
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });

  if (overlap) {
    return res.status(409).json({ error: "This charger is already booked for the selected time slot" });
  }

  const booking = await prisma.booking.create({
    data: { userId: req.user.sub, chargerId, startAt, endAt, status: "CONFIRMED" },
    include: {
      charger: { select: { label: true, location: true, powerKw: true } },
    },
  });

  // Send confirmation email (non-blocking)
  const user = await prisma.user.findUnique({ where: { id: req.user.sub }, select: { fullName: true, email: true } });
  sendBookingConfirmation(user, booking, booking.charger);

  res.status(201).json(booking);
});

router.delete("/:id", authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking || booking.userId !== req.user.sub) {
    return res.status(404).json({ error: "Booking not found" });
  }
  if (booking.status !== "CONFIRMED") {
    return res.status(400).json({ error: "Only confirmed bookings can be cancelled" });
  }
  if (booking.startAt <= new Date()) {
    return res.status(400).json({ error: "Cannot cancel a booking that has already started" });
  }

  await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
  res.status(204).end();
});

export default router;
