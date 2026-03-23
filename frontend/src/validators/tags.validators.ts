import { z } from "zod";

const createTagSchema = z.object({
    name: z.string().trim().toLowerCase().min(2, { message: "Tag name must be at least 2 characters long" }).max(20, { message: "Tag name must be at most 10 characters long" }).regex(/^[a-zA-Z0-9]+$/, { message: "Tag name must be alphanumeric" })
});



type createTagType = z.infer<typeof createTagSchema>;

export type { createTagType };
export { createTagSchema };