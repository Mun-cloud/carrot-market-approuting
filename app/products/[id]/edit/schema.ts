import { z } from "zod";
import { productSchema } from "../../add/schema";

export const productEditSchema = productSchema.extend({
  id: z.coerce.number(),
});

export type ProductEditType = z.infer<typeof productEditSchema>;
