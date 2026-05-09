import express from "express";
import prisma from "../db.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const chargers = await prisma.charger.findMany({
    where: { isActive: true },
    include: {
      bookings: {
        where: {
          status: "CONFIRMED",
          endAt: { gt: now },
          startAt: { lt: weekFromNow },
        },
        select: { startAt: true, endAt: true },
        orderBy: { startAt: "asc" },
      },
    },
    orderBy: { label: "asc" },
  });

  res.json(chargers);
});

export default router;
