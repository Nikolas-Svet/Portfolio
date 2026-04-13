import { Router } from "express";
import { parsePositiveInt, sendError } from "../http.js";
import { getDoctorById as getDoctorByIdFromRepository } from "../repositories/doctor.js";
import {
  createService,
  deleteService,
  getServiceById,
  listServices,
  updateService
} from "../repositories/service.js";
import { createServiceSchema, updateServiceSchema } from "../schemas/service.js";

type ServicesRouterDeps = {
  listServices: typeof listServices;
  getServiceById: typeof getServiceById;
  createService: typeof createService;
  updateService: typeof updateService;
  deleteService: typeof deleteService;
  getDoctorById: typeof getDoctorByIdFromRepository;
};

export function createServicesRouter(
  deps: ServicesRouterDeps = {
    listServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getDoctorById: getDoctorByIdFromRepository
  }
) {
  const router = Router();

  router.get("/", (req, res) => {
    const doctorIdParam = req.query.doctor_id;
    const hasDoctorIdFilter = doctorIdParam != null;
    const doctorId = parsePositiveInt(doctorIdParam);

    if (hasDoctorIdFilter && doctorId == null) {
      return sendError(res, 400, "Invalid doctor_id");
    }

    return res.json(deps.listServices(doctorId ?? undefined));
  });

  router.get("/:id", (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (id == null) {
      return sendError(res, 400, "Invalid id");
    }

    const service = deps.getServiceById(id);

    if (!service) {
      return sendError(res, 404, "Service not found");
    }

    return res.json(service);
  });

  router.post("/", (req, res, next) => {
    const parsed = createServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    if (!deps.getDoctorById(parsed.data.doctor_id)) {
      return sendError(res, 400, "Doctor not found");
    }

    try {
      const result = deps.createService(parsed.data);
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

    const parsed = updateServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    if (!deps.getDoctorById(parsed.data.doctor_id)) {
      return sendError(res, 400, "Doctor not found");
    }

    try {
      const updated = deps.updateService(id, parsed.data);

      if (!updated) {
        return sendError(res, 404, "Service not found");
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
      const deleted = deps.deleteService(id);

      if (!deleted) {
        return sendError(res, 404, "Service not found");
      }

      return res.json({ ok: true });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

export const servicesRouter = createServicesRouter();
