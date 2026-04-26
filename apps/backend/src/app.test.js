import { EventEmitter } from "events";
import { createRequest, createResponse } from "node-mocks-http";
import { describe, expect, it } from "vitest";
import app from "./app.js";

describe("GET /health", () => {
  it("returns status ok", async () => {
    const req = createRequest({
      method: "GET",
      url: "/health",
    });
    req.socket = { destroy: () => {} };
    req.connection = req.socket;
    const res = createResponse({ eventEmitter: EventEmitter });

    await new Promise((resolve) => {
      res.on("end", resolve);
      app.handle(req, res);
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().status).toBe("ok");
  });
});
