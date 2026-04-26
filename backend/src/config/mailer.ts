import nodemailer, { Transporter } from "nodemailer";
import envVariables from "./env.js";
import { logError } from "../utils/index.js";
import { createLogger } from "../utils/index.js";

const mailLogger = createLogger("mailer");

let transporter: Transporter | null = nodemailer.createTransport({
    host: envVariables.smtp_host,
    port: envVariables.smtp_port,
    secure: envVariables.smtp_secure,
    auth: {
        user: envVariables.smtp_user,
        pass: envVariables.smtp_pass
    },
    debug: envVariables.node_env === "development",

});


// let transporter: nodemailer.Transporter | null = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         type: "OAuth2",
//         user: envVariables.gmail_address,
//         clientId: envVariables.google_client_id,
//         clientSecret: envVariables.google_client_secret,
//         refreshToken: envVariables.gmail_refresh_token,
//     },
//     debug: envVariables.node_env === "development",

// });


export const verifyEmailConnection = async () => {
    try {
        if (!transporter) {
            mailLogger.error("Email transporter is not initialized");
            return;
        };
        await transporter.verify();
        mailLogger.info("Email transporter is ready to send emails");
    } catch (error) {
        mailLogger.error("Error verifying email transporter connection");
        logError(error, { context: "Error verifying email transporter connection" });
        transporter = null;
    }
}

export default transporter;