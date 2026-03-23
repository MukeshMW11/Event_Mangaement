import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters"),
    email: z.string({ message: "Email is required" })
        .email("Invalid email address"),
    password: z.string({ message: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    email: z.string({ message: "Email is required" })
        .email("Invalid email address"),
    password: z.string({ message: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterFormType = z.infer<typeof registerSchema>;

export const authSchema = loginSchema;
export type AuthFormType = LoginFormType;