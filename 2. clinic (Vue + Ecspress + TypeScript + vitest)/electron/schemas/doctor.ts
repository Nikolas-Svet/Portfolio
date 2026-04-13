import { z } from "zod";

const requiredText = z.string().trim().min(1);

export const createDoctorSchema = z.object({
  doctor_type: requiredText,
  full_name: requiredText
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

export const updateDoctorSchema = createDoctorSchema;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
