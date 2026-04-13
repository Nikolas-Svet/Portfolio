import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type InitDbOptions = {
  seed?: boolean;
};

let db: Database.Database | null = null;

const migrations: Array<{ id: number; name: string; sql: string }> = [
  {
    id: 1,
    name: "init",
    sql: `
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_type TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL DEFAULT 0,
        doctor_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id INTEGER NOT NULL,
        total_price REAL NOT NULL DEFAULT 0,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_services_doctor ON services(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
      CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
    `
  }
];

export function initDb(dbPath: string, options: InitDbOptions = {}) {
  const { seed = true } = options;
  const dir = path.dirname(dbPath);

  if (dir !== "." && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  closeDb();

  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");

  if (!isSchemaCompatible(db)) {
    resetDb(db);
  }

  runMigrations(db);

  if (seed) {
    seedDb(db);
  }

  return db;
}

export function closeDb() {
  if (!db) {
    return;
  }

  db.close();
  db = null;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }

  return db;
}

export function isSchemaCompatible(database: Database.Database) {
  const hasDoctors = tableHasColumns(database, "doctors", ["doctor_type", "full_name"]);
  const hasServices = tableHasColumns(database, "services", ["doctor_id", "price"]);
  const hasAppointments = tableHasColumns(database, "appointments", [
    "service_id",
    "total_price",
    "description"
  ]);

  return hasDoctors && hasServices && hasAppointments;
}

function runMigrations(database: Database.Database) {
  const currentVersion = Number(database.pragma("user_version", { simple: true }));
  const pendingMigrations = migrations.filter((migration) => migration.id > currentVersion);

  if (pendingMigrations.length === 0) {
    return;
  }

  const applyMigrations = database.transaction(() => {
    for (const migration of pendingMigrations) {
      database.exec(migration.sql);
      database.pragma(`user_version = ${migration.id}`);
    }
  });

  applyMigrations();
}

function seedDb(database: Database.Database) {
  const doctorCount = Number(
    (database.prepare("SELECT COUNT(*) as count FROM doctors").get() as { count: number }).count
  );

  if (doctorCount > 0) {
    return;
  }

  const insertDoctor = database.prepare(
    "INSERT INTO doctors (doctor_type, full_name) VALUES (?, ?)"
  );
  const insertService = database.prepare(
    "INSERT INTO services (name, price, doctor_id) VALUES (?, ?, ?)"
  );

  const seedTransaction = database.transaction(() => {
    const doctorIds = [
      Number(insertDoctor.run("Травматолог", "Стаценко Илья Олегович").lastInsertRowid),
      Number(insertDoctor.run("Травматолог", "Буков Никита Сергеевич").lastInsertRowid)
    ];

    const services: Array<[doctorId: number, name: string, price: number]> = [
      [doctorIds[0], "Первичный прием", 3500],
      [doctorIds[0], "Повторный прием", 3200],
      [doctorIds[0], "Укол", 1500],
      [doctorIds[0], "Расширенная консультация", 0],
      [doctorIds[0], "Стельки", 12000],
      [doctorIds[0], "Плексатрон", 0],
      [doctorIds[0], "Дипроспан", 0],
      [doctorIds[0], "Флексатрон соло 3 мл", 0],
      [doctorIds[0], "Флексатрон соло 2 мл", 0],
      [doctorIds[0], "Композитрон-2", 0],
      [doctorIds[1], "Первичный прием", 3000],
      [doctorIds[1], "Повторный прием", 2700],
      [doctorIds[1], "Укол", 1500],
      [doctorIds[1], "Стельки", 12000],
      [doctorIds[1], "Дипроспан", 0],
      [doctorIds[1], "Плексатрон", 0]
    ];

    for (const [doctorId, name, price] of services) {
      insertService.run(name, price, doctorId);
    }
  });

  seedTransaction();
}

function tableHasColumns(database: Database.Database, table: string, columns: string[]) {
  try {
    const info = database.pragma(`table_info(${table})`) as Array<{ name: string }>;
    const names = new Set(info.map((column) => column.name));

    return columns.every((column) => names.has(column));
  } catch {
    return false;
  }
}

function resetDb(database: Database.Database) {
  database.exec(`
    DROP TABLE IF EXISTS appointments;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS doctors;
    PRAGMA user_version = 0;
  `);
}
