import { z } from "zod";



const createEventSchema = z.object({
    title: z.string().min(3, "Event title must be at least 3 characters").max(40, "Event title shouldn't exceed more than 20 characters"),
    description: z.string().min(5, "Event title must be at least 3 characters").max(100, "Event title shouldn't exceed more than 20 characters"),
    location: z.string().min(5, "Event title must be at least 3 characters").max(50, "Event title shouldn't exceed more than 20 characters"),
    event_date: z.coerce.date({ message: "Invalid date format" }).refine((date) => date > new Date(), { message: "Event date must be in the future", }),
    event_type: z.enum(["public", "private"], { message: "Event type is required" }),
    tags: z.array(z.uuid({ message: "Invalid tag Id" })).max(10, { message: "You can add at most 10 tags" }).optional(),
});

const editEventSchema = z.object({
    title: z.string().min(3, "Event title must be at least 3 characters").max(40, "Event title shouldn't exceed more than 20 characters").optional(),
    description: z.string().min(5, "Event title must be at least 3 characters").max(100, "Event title shouldn't exceed more than 20 characters").optional(),
    location: z.string().min(5, "Event title must be at least 3 characters").max(50, "Event title shouldn't exceed more than 20 characters").optional(),
    event_date: z.coerce.date({ message: "Invalid date format" }).refine((date) => date > new Date(), { message: "Event date must be in the future", }).optional(),
    event_type: z.enum(["public", "private"], { message: "Event type is required" }).optional(),
    tags: z.array(z.uuid({ message: "Invalid tag Id" })).max(10, { message: "You can add at most 10 tags" }).optional(),
});



type createEventSchemaType = z.infer<typeof createEventSchema>;
type editEventSchemaType = z.infer<typeof editEventSchema>;

export type { createEventSchemaType ,editEventSchemaType};

export { createEventSchema,editEventSchema};