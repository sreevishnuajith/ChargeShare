import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../db.js";

const SUFFIX = "@auth-test.local";

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { endsWith: SUFFIX } } });
  await prisma.$disconnect();
});

describe("POST /auth/register", () => {
  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { endsWith: SUFFIX } } });
  });

  it("creates a user and returns a token", async () => {
    const res = await request(app).post("/auth/register").send({
      fullName: "New User",
      email: `new${SUFFIX}`,
      password: "Password123!",
      buildingId: 1,
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(`new${SUFFIX}`);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("returns 409 when email already exists", async () => {
    const body = { fullName: "Dup", email: `dup${SUFFIX}`, password: "Password123!", buildingId: 1 };
    await request(app).post("/auth/register").send(body);
    const res = await request(app).post("/auth/register").send(body);
    expect(res.status).toBe(409);
  });

  it("returns 400 for an invalid email", async () => {
    const res = await request(app).post("/auth/register").send({
      fullName: "Test",
      email: "not-an-email",
      password: "Password123!",
      buildingId: 1,
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is shorter than 8 characters", async () => {
    const res = await request(app).post("/auth/register").send({
      fullName: "Test",
      email: `short${SUFFIX}`,
      password: "abc",
      buildingId: 1,
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  beforeAll(async () => {
    await request(app).post("/auth/register").send({
      fullName: "Login Test",
      email: `login${SUFFIX}`,
      password: "Password123!",
      buildingId: 1,
    });
  });

  it("returns a token on valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: `login${SUFFIX}`, password: "Password123!" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("returns 401 for a wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: `login${SUFFIX}`, password: "WrongPassword!" });
    expect(res.status).toBe(401);
  });

  it("returns 401 for an unknown email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: `nobody${SUFFIX}`, password: "Password123!" });
    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me", () => {
  let token;

  beforeAll(async () => {
    await request(app).post("/auth/register").send({
      fullName: "Me Test",
      email: `me${SUFFIX}`,
      password: "Password123!",
      buildingId: 1,
    });
    const res = await request(app)
      .post("/auth/login")
      .send({ email: `me${SUFFIX}`, password: "Password123!" });
    token = res.body.token;
  });

  it("returns the current user profile for a valid token", async () => {
    const res = await request(app).get("/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(`me${SUFFIX}`);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("returns 401 with no token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 401 with a malformed token", async () => {
    const res = await request(app).get("/auth/me").set("Authorization", "Bearer not.a.real.token");
    expect(res.status).toBe(401);
  });
});
