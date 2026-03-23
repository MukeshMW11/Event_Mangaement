import { createLogger } from "./logger.js";

const logger = createLogger("error");

const logError = (error: any, context: Record<string, any> = {}) => {
  const errorLog: Record<string, any> = {
    name: error?.name,
    message: error?.message,
    stack: error?.stack,
    code: error?.code,
    ...context,
  };

  if (error?.response) {
    errorLog.response = {
      status: error.response.status,
      data: error.response.data,
    };
  }

  logger.error(errorLog, "Application error occurred");
};

export const logWarning = (warning: any, context: Record<string, any> = {}) => {
  logger.warn({ warning, ...context }, "Application warning occurred");
};

export default logError;