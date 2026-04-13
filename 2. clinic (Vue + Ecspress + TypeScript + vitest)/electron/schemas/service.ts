import { z } from "zod";

const requiredName = z.string().trim().min(1);

export const createServiceSchema = z.object({
  name: requiredName,
  price: z.number().nonnegative(),
  doctor_id: z.number().int().positive()
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
