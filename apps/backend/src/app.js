import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import logger from "./logger.js";
import authRouter from "./routes/auth.js";
import chargersRouter from "./routes/chargers.js";
import bookingsRouter from "./routes/bookings.js";
import sessionsRouter from "./routes/sessions.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "ChargeShare API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRouter);
app.use("/chargers", chargersRouter);
app.use("/bookings", bookingsRouter);
app.use("/sessions", sessionsRouter);

export default app;
