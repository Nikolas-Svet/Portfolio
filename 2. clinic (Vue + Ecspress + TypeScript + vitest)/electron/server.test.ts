import { describe, expect, it } from "vitest";
import { createApp } from "./server.js";
import {
  createMockResponse,
  getAppErrorHandler,
  getAppHandler,
  invokeHandler
} from "./testUtils.js";

describe("server app", () => {
  it("serves /api/health without Electron lifecycle", async () => {
    const app = createApp();
    const handler = getAppHandler(app, "get", "/api/health");
    const { response, nextError } = await invokeHandler(handler, {});

    expect(nextError).toBeUndefined();
    expect(response.statusCode).toBe(200);
    expect(response.jsonBody).toEqual({ status: "ok" });
  });

  it("returns a unified json response from the 500 handler", async () => {
    const app = createApp({
      configureApp(instance) {
        instance.get("/api/boom", () => {
          throw new Error("Boom");
        });
      }
    });
    const routeHandler = getAppHandler(app, "get", "/api/boom");
    const errorHandler = getAppErrorHandler(app);
    const routeResult = await invokeHandler(routeHandler, {});
    const response = createMockResponse();

    await errorHandler(routeResult.nextError, {}, response, () => undefined);

    expect(routeResult.nextError).toBeInstanceOf(Error);
    expect(response.statusCode).toBe(500);
    expect(response.jsonBody).toEqual({ error: "Boom" });
  });
});
