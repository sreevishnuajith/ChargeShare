import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../db.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  buildingId: z.number().int().positive(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
}

router.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }
  const { fullName, email, password, buildingId } = result.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, email, passwordHash, buildingId },
    });

    return res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten().fieldErrors });
  }
  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({ user: publicUser(user), token: signToken(user) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: publicUser(user) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
