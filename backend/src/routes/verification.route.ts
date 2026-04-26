
import express from "express";
import { verificationController } from "../controllers/verification.controller.js";
import validateData from "../middlewares/validator.middleware.js";
import { emailVerificationSchema } from "../validators/index.js";
import { emailVerificationLimiter } from "../middlewares/rateLimiter.js";

const verificationRouter = express.Router();


verificationRouter.get("/verify-email", verificationController.verifyEmail);
verificationRouter.post("/send-verification-email", emailVerificationLimiter, validateData(emailVerificationSchema), verificationController.sendVerificationEmail);


export default verificationRouter;