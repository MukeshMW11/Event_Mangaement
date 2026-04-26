import { registerSchema, loginSchema, emailVerificationSchema } from "./auth.validators.js";
import type { loginType, registerType, emailVerificationType } from "./auth.validators.js";

export type { loginType, registerType, emailVerificationType };
export { registerSchema, loginSchema, emailVerificationSchema };