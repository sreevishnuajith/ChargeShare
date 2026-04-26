import dotenv from "dotenv";
import app from "./app.js";
import logger from "./logger.js";

dotenv.config();

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  logger.info({ port }, "ChargeShare API running");
});
