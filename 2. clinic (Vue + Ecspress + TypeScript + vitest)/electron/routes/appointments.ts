import { Router } from "express";
import { parsePositiveInt, sendError } from "../http.js";
import { getServiceById as getServiceByIdFromRepository } from "../repositories/service.js";
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  listAppointments,
  updateAppointment
} from "../repositories/appointment.js";
import { createAppointmentSchema, updateAppointmentSchema } from "../schemas/appointment.js";

type AppointmentsRouterDeps = {
  listAppointments: typeof listAppointments;
  getAppointmentById: typeof getAppointmentById;
  createAppointment: typeof createAppointment;
  updateAppointment: typeof updateAppointment;
  deleteAppointment: typeof deleteAppointment;
  getServiceById: typeof getServiceByIdFromRepository;
};

export function createAppointmentsRouter(
  deps: AppointmentsRouterDeps = {
    listAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getServiceById: getServiceByIdFromRepository
  }
) {
  const router = Router();

  router.get("/", (req, res) => {
    const limitParam = req.query.limit;
    const hasLimit = limitParam != null;
    const limit = parsePositiveInt(limitParam);

    if (hasLimit && limit == null) {
      return sendError(res, 400, "Invalid limit");
    }

    return res.json(deps.listAppointments(limit ?? undefined));
  });

  router.get("/:id", (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (id == null) {
      return sendError(res, 400, "Invalid id");
    }

    const appointment = deps.getAppointmentById(id);

    if (!appointment) {
      return sendError(res, 404, "Appointment not found");
    }

    return res.json(appointment);
  });

  router.post("/", (req, res, next) => {
    const parsed = createAppointmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    if (!deps.getServiceById(parsed.data.service_id)) {
      return sendError(res, 400, "Service not found");
    }

    try {
      const result = deps.createAppointment(parsed.data);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.put("/:id", (req, res, next) => {
    const id = parsePositiveInt(req.params.id);

    if (id == null) {
      return sendError(res, 400, "Invalid id");
    }

    const parsed = updateAppointmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    if (!deps.getServiceById(parsed.data.service_id)) {
      return sendError(res, 400, "Service not found");
    }

    try {
      const updated = deps.updateAppointment(id, parsed.data);

      if (!updated) {
        return sendError(res, 404, "Appointment not found");
      }

      return res.json({ ok: true });
    } catch (error) {
      return next(error);
    }
  });

  router.delete("/:id", (req, res, next) => {
    const id = parsePositiveInt(req.params.id);

    if (id == null) {
      return sendError(res, 400, "Invalid id");
    }

    try {
      const deleted = deps.deleteAppointment(id);

      if (!deleted) {
        return sendError(res, 404, "Appointment not found");
      }

      return res.json({ ok: true });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

export const appointmentsRouter = createAppointmentsRouter();
