import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6)
});


const loginSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6),
});

const emailVerificationSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
});


type loginType = z.infer<typeof loginSchema>;
type registerType = z.infer<typeof registerSchema>;
type emailVerificationType = z.infer<typeof emailVerificationSchema>;

export type { loginType, registerType, emailVerificationType };
export { registerSchema, loginSchema, emailVerificationSchema };