
import express from "express";
import { verificationController } from "../controllers/verification.controller.js";

const verificationRouter = express.Router();


verificationRouter.get("/verify-email", verificationController.verifyEmail);
verificationRouter.post("/send-verification-email", verificationController.sendVerificationEmail);


export default verificationRouter;