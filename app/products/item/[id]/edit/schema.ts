import { productSchema } from "@/app/products/add/schema";
import { z } from "zod";

export const productEditSchema = productSchema.extend({
  id: z.coerce.number(),
});

export type ProductEditType = z.infer<typeof productEditSchema>;
