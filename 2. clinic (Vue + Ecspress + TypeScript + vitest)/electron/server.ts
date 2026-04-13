import express from "express";
import http from "node:http";
import { createErrorResponse } from "./http.js";
import { appointmentsRouter } from "./routes/appointments.js";
import { doctorsRouter } from "./routes/doctors.js";
import { reportsRouter } from "./routes/reports.js";
import { servicesRouter } from "./routes/services.js";

type CreateAppOptions = {
  doctorsRouter?: express.Router;
  servicesRouter?: express.Router;
  appointmentsRouter?: express.Router;
  reportsRouter?: express.Router;
  configureApp?: (app: express.Express) => void;
};

export function createApp(options: CreateAppOptions = {}) {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/doctors", options.doctorsRouter ?? doctorsRouter);
  app.use("/api/services", options.servicesRouter ?? servicesRouter);
  app.use("/api/appointments", options.appointmentsRouter ?? appointmentsRouter);
  app.use("/api/reports", options.reportsRouter ?? reportsRouter);

  options.configureApp?.(app);

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json(createErrorResponse(message));
    }
  );

  return app;
}

export function startServer(port: number) {
  const server = http.createServer(createApp());
  server.listen(port, "127.0.0.1");
  return server;
}
