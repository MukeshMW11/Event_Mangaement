import { z } from "zod";



export const emailVerificationSchema = z.object({
    email: z.string({ message: "Email is required" }).email({ message: "Invalid email address" }),
})