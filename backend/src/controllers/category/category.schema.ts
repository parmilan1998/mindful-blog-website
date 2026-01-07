import z from "zod";
import { Status } from "../../constant/enum";

export const categorySchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  slug: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(50, "Name must be less than 20 characters")
    .trim()
    .lowercase(),
  image: z.string().optional(),
  description: z
    .string()
    .max(200, "Description must be less than 250 characters")
    .optional(),
  status: z.enum([Status.ACTIVE, Status.INACTIVE]).default(Status.ACTIVE),
});

export const updateCategorySchema = categorySchema.partial().extend({
  id: z.string().min(1, "Category ID is required"),
});
