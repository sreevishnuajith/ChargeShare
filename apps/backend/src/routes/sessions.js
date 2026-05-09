import express from "express";
import prisma from "../db.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  const sessions = await prisma.session.findMany({
    where: { booking: { userId: req.user.sub } },
    include: {
      booking: {
        include: {
          charger: { select: { label: true, location: true, powerKw: true } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });
  res.json(sessions);
});

export default router;
