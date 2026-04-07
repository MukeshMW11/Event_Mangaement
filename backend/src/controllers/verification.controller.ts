import { Request, Response, NextFunction } from "express";
import { authServices } from "../services/auth.service.js";
import { verificationService } from "../services/verification.service.js";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token as string;
    try {
        const userId = await verificationService.consumeVerificationToken(token);
        await verificationService.markVerfied(userId);
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        next(error);
    }
};



const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.body.email;
    try {
        const token = await verificationService.generateVerficationToken(userEmail);
        if (!token) throw new Error("Failed to generate verification token");
        await verificationService.sendVerificationEmail(userEmail, token);
        return res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
        next(error);
    }
};



export const verificationController = { verifyEmail, sendVerificationEmail };