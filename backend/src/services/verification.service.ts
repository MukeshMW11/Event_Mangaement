import { authRepositories } from "../repositories/auth.repository.js";
import { verificationRepositories } from "../repositories/verification.repositories.js";
import AppError from "../utils/AppError.js";
import { forgetPassword, transporter, verifyEmail } from "../utils/index.js";
import envVariables from "../config/env.js";
import crypto from "crypto";


const sendVerificationEmail = async (email: string, token: string) => {
    const validUser = await authRepositories.findUserByEmailRepository(email);
    if (!validUser) throw new AppError("Email is sent if an email exists", 200);

    if (validUser.verified_at) throw new AppError("Email is already verified", 400);

    const link = `${envVariables.app_base_url}/verification/verify-email?token=${token}`;
    if (!transporter) throw new AppError("Email service is not available", 503);
    await transporter.sendMail({
        from: `Event Management <${envVariables.gmail_address}>`,
        to: email,
        subject: "Email Verification",
        html: verifyEmail(link)
    });
};

const sendPasswordResetEmail = async (email: string, token: string) => {
    const validUser = await authRepositories.findUserByEmailRepository(email);
    if (!validUser) throw new AppError("User with this email does not exist", 404);

    const link = `${envVariables.app_base_url}/reset-password?token=${token}`;
    if (!transporter) throw new AppError("Email service is not available", 503);
    await transporter.sendMail({
        from: `Event Management <${envVariables.gmail_address}>`,
        to: email,
        subject: "Password Reset",
        html: forgetPassword(link),
    });
}

const generateVerificationToken = async (email: string) => {
    const validUser = await authRepositories.findUserByEmailRepository(email);
    if (!validUser) throw new AppError("User with this email does not exist", 404);

    await verificationRepositories.deleteExistingTokensByUserId(validUser.id);

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await verificationRepositories.createVerificationToken(validUser.id, token, expires_at);

    return token;
};


const consumeVerificationToken = async (token: string) => {
    const validToken = await verificationRepositories.findValidToken(token);
    if (!validToken) throw new AppError("Invalid  token", 400);

    if (new Date(validToken.expires_at) < new Date(Date.now())) {
        await verificationRepositories.deleteExistingTokensByUserToken(token);
        throw new AppError("Token has expired", 400);
    };

    await verificationRepositories.deleteExistingTokensByUserToken(token);

    return validToken.user_id;
};


const markVerified = async (userId: number) => {
    await verificationRepositories.markEmailAsVerified(userId);
};


export const verificationService = { sendVerificationEmail, generateVerificationToken, consumeVerificationToken, sendPasswordResetEmail, markVerified };