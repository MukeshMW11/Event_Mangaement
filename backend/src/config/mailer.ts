import nodemailer from "nodemailer";
import envVariables from "./env.js";


const transporter = nodemailer.createTransport({
    host: envVariables.smtp_host,
    port: envVariables.smtp_port,
    secure: envVariables.smtp_secure,
    auth: {
        user: envVariables.smtp_user,
        pass: envVariables.smtp_pass
    },
    debug: envVariables.node_env === "development",

});


export default transporter;