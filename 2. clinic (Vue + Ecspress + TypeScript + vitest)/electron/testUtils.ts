import type Database from "better-sqlite3";
import type express from "express";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { closeDb, initDb } from "./db.js";

type TestDbOptions = {
  seed?: boolean;
};

export function createTestDb(options: TestDbOptions = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "clinic-backend-"));
  const dbPath = path.join(directory, "test.sqlite");
  const database = initDb(dbPath, { seed: options.seed ?? false });

  return {
    dbPath,
    database,
    cleanup() {
      closeDb();
      fs.rmSync(directory, { recursive: true, force: true });
    }
  };
}

export function countRows(database: Database.Database, table: string) {
  const row = database.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
  return row.count;
}

type StackLayer = {
  handle: unknown;
  route?: {
    path?: string;
    methods?: Record<string, boolean>;
    stack?: Array<{ handle: unknown }>;
  };
};

export function getRouterHandler(
  router: { stack: StackLayer[] },
  method: "get" | "post" | "put" | "delete",
  routePath: string
) {
  const layer = router.stack.find(
    (entry) => entry.route?.path === routePath && entry.route.methods?.[method]
  );

  if (!layer?.route?.stack?.[0]?.handle) {
    throw new Error(`Route ${method.toUpperCase()} ${routePath} was not registered`);
  }

  return layer.route.stack[0].handle as (
    req: Record<string, unknown>,
    res: ReturnType<typeof createMockResponse>,
    next: (error?: unknown) => void
  ) => unknown;
}

export function getAppHandler(
  app: express.Express,
  method: "get" | "post" | "put" | "delete",
  routePath: string
) {
  const stack = (
    app as unknown as {
      _router?: { stack?: StackLayer[] };
    }
  )._router?.stack;

  if (!stack) {
    throw new Error("Express app router stack is not available");
  }

  return getRouterHandler({ stack }, method, routePath);
}

export function getAppErrorHandler(app: express.Express) {
  const stack = (
    app as unknown as {
      _router?: { stack?: StackLayer[] };
    }
  )._router?.stack;

  const layer = stack?.find((entry) => typeof entry.handle === "function" && entry.handle.length === 4);

  if (!layer || typeof layer.handle !== "function") {
    throw new Error("Express error handler was not registered");
  }

  return layer.handle as (
    error: unknown,
    req: Record<string, unknown>,
    res: ReturnType<typeof createMockResponse>,
    next: (error?: unknown) => void
  ) => unknown;
}

export function createMockResponse() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    jsonBody: undefined as unknown,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.jsonBody = payload;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    send(payload: unknown) {
      this.body = payload;
      return this;
    }
  };
}

export async function invokeHandler(
  handler: (
    req: Record<string, unknown>,
    res: ReturnType<typeof createMockResponse>,
    next: (error?: unknown) => void
  ) => unknown,
  request: Record<string, unknown>
) {
  const response = createMockResponse();
  let nextError: unknown;

  try {
    await handler(request, response, (error?: unknown) => {
      nextError = error;
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    nextError = error;
  }

  return { response, nextError };
}
