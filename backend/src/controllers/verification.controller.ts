import { Request, Response, NextFunction } from "express";
import { verificationService } from "../services/verification.service.js";
import { emailVerificationSuccess } from "../utils/emailVerification/emailTemplates.js";
import envVariables from "../config/env.js";

const frontendLoginUrl = envVariables.frontendUrl;

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token as string;
    try {
        const userId = await verificationService.consumeVerificationToken(token);

        await verificationService.markVerified(userId);

        const loginPageUrl = `${frontendLoginUrl}/login`;

        return res.status(200).send(emailVerificationSuccess(loginPageUrl));
    } catch (error) {
        next(error);
    }
};



const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.body.email;
    try {
        const token = await verificationService.generateVerificationToken(userEmail);
        if (!token) throw new Error("Failed to generate verification token");
        await verificationService.sendVerificationEmail(userEmail, token);
        return res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
        return res.status(200).json({ message: "If an account exists, a verification email will be sent" });
    }
};



export const verificationController = { verifyEmail, sendVerificationEmail };