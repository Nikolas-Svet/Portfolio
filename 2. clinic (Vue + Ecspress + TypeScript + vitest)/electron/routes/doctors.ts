import { Router } from "express";
import { parsePositiveInt, sendError } from "../http.js";
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  listDoctors,
  updateDoctor
} from "../repositories/doctor.js";
import { createDoctorSchema, updateDoctorSchema } from "../schemas/doctor.js";

type DoctorsRouterDeps = {
  listDoctors: typeof listDoctors;
  getDoctorById: typeof getDoctorById;
  createDoctor: typeof createDoctor;
  updateDoctor: typeof updateDoctor;
  deleteDoctor: typeof deleteDoctor;
};

export function createDoctorsRouter(
  deps: DoctorsRouterDeps = {
    listDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
  }
) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(deps.listDoctors());
  });

  router.get("/:id", (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (id == null) {
      return sendError(res, 400, "Invalid id");
    }

    const doctor = deps.getDoctorById(id);

    if (!doctor) {
      return sendError(res, 404, "Doctor not found");
    }

    return res.json(doctor);
  });

  router.post("/", (req, res, next) => {
    const parsed = createDoctorSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    try {
      const result = deps.createDoctor(parsed.data);
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

    const parsed = updateDoctorSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, 422, "Invalid payload", parsed.error.flatten());
    }

    try {
      const updated = deps.updateDoctor(id, parsed.data);

      if (!updated) {
        return sendError(res, 404, "Doctor not found");
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
      const deleted = deps.deleteDoctor(id);

      if (!deleted) {
        return sendError(res, 404, "Doctor not found");
      }

      return res.json({ ok: true });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

export const doctorsRouter = createDoctorsRouter();
