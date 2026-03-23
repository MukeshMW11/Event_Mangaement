import path from 'path';
import { ENVIRONMENTS } from './constant.js';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loggerConfig = {
    [ENVIRONMENTS.DEVELOPMENT]: {
        level: "debug",
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: "SYS:standard",

            },

        }
    },
    [ENVIRONMENTS.PRODUCTION]: {
        level: "info",
        transport: {
            target: "pino/file",
            options: {
                destination: path.join(__dirname, "../../../logs/app.log"),
                mkdir: true,
                sync: false
            },

        }
    }

}

export default loggerConfig;