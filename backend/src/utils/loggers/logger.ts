import pino, { Logger, LoggerOptions } from "pino";
import loggerConfig from "./config.js";
import { ENVIRONMENTS } from "./constant.js";


const createLogger = (serviceName = "app", options: LoggerOptions = {}): Logger => {
    const env = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;
    const baseConfig = loggerConfig[env] || {};
    const logger = pino({
        name: serviceName,
        ...baseConfig,
        ...options

    });


    return logger;
}



const createChildLogger = (parentLogger: Logger, bindings: Record<string, any>): Logger => {
    return parentLogger.child(bindings);
}


export { createLogger, createChildLogger };