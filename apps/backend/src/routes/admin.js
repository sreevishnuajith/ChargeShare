import express from "express";
import prisma from "../db.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate, (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
});

// Summary stats for admin dashboard
router.get("/dashboard", async (_req, res) => {
  const [totalUsers, totalBookings, totalSessions, chargers] = await Promise.all([
    prisma.user.count({ where: { role: "RESIDENT" } }),
    prisma.booking.count(),
    prisma.session.count({ where: { endedAt: { not: null } } }),
    prisma.charger.findMany({ where: { isActive: true } }),
  ]);

  const sessionAgg = await prisma.session.aggregate({
    _sum: { energyKwh: true, costAud: true },
    where: { endedAt: { not: null } },
  });

  // Sessions per day (last 14 days)
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const recentSessions = await prisma.session.findMany({
    where: { endedAt: { gte: since, not: null } },
    select: { endedAt: true, energyKwh: true, costAud: true },
  });

  const dailyMap = new Map();
  for (const s of recentSessions) {
    const day = s.endedAt.toISOString().slice(0, 10);
    const existing = dailyMap.get(day) ?? { sessions: 0, revenue: 0, energy: 0 };
    existing.sessions += 1;
    existing.revenue += s.costAud;
    existing.energy += s.energyKwh;
    dailyMap.set(day, existing);
  }

  const dailyStats = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date,
      sessions: stats.sessions,
      revenue: parseFloat(stats.revenue.toFixed(2)),
      energy: parseFloat(stats.energy.toFixed(2)),
    }));

  // Charger utilization: count completed sessions per charger
  const chargerUtilization = await Promise.all(
    chargers.map(async (c) => {
      const count = await prisma.booking.count({
        where: { chargerId: c.id, status: "COMPLETED" },
      });
      return { label: c.label, location: c.location, powerKw: c.powerKw, completedSessions: count };
    })
  );

  res.json({
    summary: {
      totalUsers,
      totalBookings,
      totalSessions,
      totalEnergyKwh: parseFloat((sessionAgg._sum.energyKwh ?? 0).toFixed(2)),
      totalRevenueAud: parseFloat((sessionAgg._sum.costAud ?? 0).toFixed(2)),
    },
    dailyStats,
    chargerUtilization,
  });
});

// All users (residents)
router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { role: "RESIDENT" },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
      _count: { select: { bookings: true, invoices: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  res.json(users);
});

// All sessions
router.get("/sessions", async (_req, res) => {
  const sessions = await prisma.session.findMany({
    include: {
      booking: {
        include: {
          user: { select: { fullName: true, email: true } },
          charger: { select: { label: true, location: true } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });
  res.json(sessions);
});

export default router;
