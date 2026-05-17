import express from "express";
import { z } from "zod";
import prisma from "../db.js";
import { authenticate } from "../middleware/authenticate.js";
import { sendInvoiceNotification } from "../mailer.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// Resident: list their own invoices
router.get("/me", authenticate, async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId: req.user.sub },
    orderBy: { periodStart: "desc" },
  });
  res.json(invoices);
});

const generateSchema = z.object({
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
});

// Admin: generate invoices for all residents for a given period
router.post("/generate", authenticate, requireAdmin, async (req, res) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { periodStart: startStr, periodEnd: endStr } = parsed.data;
  const periodStart = new Date(startStr);
  const periodEnd = new Date(endStr);

  if (periodStart >= periodEnd) {
    return res.status(400).json({ error: "periodStart must be before periodEnd" });
  }

  // Find all completed sessions in the period, grouped by user
  const sessions = await prisma.session.findMany({
    where: {
      endedAt: { gte: periodStart, lte: periodEnd },
      booking: { status: "COMPLETED" },
    },
    include: {
      booking: { select: { userId: true } },
    },
  });

  // Aggregate total cost per user
  const totalsMap = new Map();
  for (const session of sessions) {
    const uid = session.booking.userId;
    totalsMap.set(uid, (totalsMap.get(uid) ?? 0) + session.costAud);
  }

  if (totalsMap.size === 0) {
    return res.status(200).json({ created: 0, invoices: [] });
  }

  // Create invoices in a transaction
  const invoices = await prisma.$transaction(
    [...totalsMap.entries()].map(([userId, totalAud]) =>
      prisma.invoice.create({
        data: {
          userId,
          periodStart,
          periodEnd,
          totalAud: parseFloat(totalAud.toFixed(2)),
          status: "DRAFT",
        },
        include: { user: { select: { fullName: true, email: true } } },
      })
    )
  );

  // Send notification emails (non-blocking)
  for (const invoice of invoices) {
    sendInvoiceNotification(invoice.user, invoice);
  }

  res.status(201).json({ created: invoices.length, invoices });
});

const statusSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "PAID"]),
});

// Admin: update invoice status
router.put("/:id/status", authenticate, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { user: { select: { fullName: true, email: true } } },
  });

  res.json(updated);
});

// Admin: list all invoices
router.get("/", authenticate, requireAdmin, async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    include: { user: { select: { fullName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(invoices);
});

export default router;
