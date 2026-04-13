import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { closeDb, initDb, isSchemaCompatible } from "./db.js";

const tempDirectories: string[] = [];

describe("db init and migration sanity", () => {
  afterEach(() => {
    closeDb();

    while (tempDirectories.length > 0) {
      const directory = tempDirectories.pop();

      if (directory) {
        fs.rmSync(directory, { recursive: true, force: true });
      }
    }
  });

  it("initializes expected tables, enables foreign keys and does not fail on an empty db", () => {
    const dbPath = createTempDbPath();
    let database: Database.Database | undefined;

    expect(() => {
      database = initDb(dbPath, { seed: false });
    }).not.toThrow();

    const tableNames = database!
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      )
      .all() as Array<{ name: string }>;
    const foreignKeys = Number(database!.pragma("foreign_keys", { simple: true }));
    const userVersion = Number(database!.pragma("user_version", { simple: true }));

    expect(tableNames.map((table) => table.name)).toEqual(["appointments", "doctors", "services"]);
    expect(foreignKeys).toBe(1);
    expect(userVersion).toBe(1);
  });

  it("reports schema compatibility for initialized and incompatible databases", () => {
    const validPath = createTempDbPath();
    const validDatabase = initDb(validPath, { seed: false });

    expect(isSchemaCompatible(validDatabase)).toBe(true);

    closeDb();

    const invalidPath = createTempDbPath();
    const invalidDatabase = new Database(invalidPath);

    try {
      invalidDatabase.exec(`
        CREATE TABLE doctors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL
        );
      `);

      expect(isSchemaCompatible(invalidDatabase)).toBe(false);
    } finally {
      invalidDatabase.close();
    }
  });

  it("resets incompatible schema and reapplies migrations", () => {
    const dbPath = createTempDbPath();
    const database = new Database(dbPath);

    try {
      database.exec(`
        CREATE TABLE doctors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL
        );
        PRAGMA user_version = 99;
      `);
    } finally {
      database.close();
    }

    initDb(dbPath, { seed: false });

    const migrated = new Database(dbPath);

    try {
      const doctorColumns = migrated
        .pragma("table_info(doctors)") as Array<{ name: string }>;
      const tables = migrated
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
        .all() as Array<{ name: string }>;
      const userVersion = Number(migrated.pragma("user_version", { simple: true }));

      expect(doctorColumns.map((column) => column.name)).toContain("doctor_type");
      expect(tables.map((table) => table.name)).toEqual(["appointments", "doctors", "services"]);
      expect(userVersion).toBe(1);
    } finally {
      migrated.close();
    }
  });
});

function createTempDbPath() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "clinic-db-"));
  tempDirectories.push(directory);
  return path.join(directory, "clinic.sqlite");
}
