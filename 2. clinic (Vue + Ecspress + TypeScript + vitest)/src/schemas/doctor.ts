import { z } from "zod";

export const doctorSchema = z.object({
  doctor_type: z.string().min(1),
  full_name: z.string().min(1)
});

export type DoctorInput = z.infer<typeof doctorSchema>;
