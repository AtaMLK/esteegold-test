import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Title is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(1, "description is required"),
  material: z.enum(["silver", "gold"], {
    required_error: "Material is required",
  }),
  stock: z.coerce.number().min(1).max(10, "Stock must be between 1 and 20",{
    required_error: "Stock number is required",
  }),
  image: z.any().refine((files) => files?.length === 1, "Image is required"),
  category_id: z.string().nullable().optional(),
});
