import { pinoHttp } from "pino-http";
import { createLogger } from "../utils/loggers/logger.js";
import { RequestHandler } from "express";
import { IncomingMessage, ServerResponse } from "node:http";
import crypto from "crypto";

const requestLogger = (): RequestHandler => {
    const logger = createLogger("http");
    const pinoHttpFactory = (pinoHttp as any).default || pinoHttp;
    return pinoHttpFactory({
        logger,
        genReqId: (req: IncomingMessage) => crypto.randomUUID(),
        customLogLevel(req: IncomingMessage, res: ServerResponse, err: Error) {
            if (err || res.statusCode >= 500) return "error";
            if (res.statusCode >= 400) return "warn";
            return "info";
        },
        customSuccessMessage(req: IncomingMessage, res: ServerResponse) {
            return `${req.method} ${req.url} completed with ${res.statusCode} with correlationId ${req.id}`;
        },
        customErrorMessage(req: IncomingMessage, res: ServerResponse, err: Error) {
            return `${req.method} ${req.url} failed with ${res.statusCode}`;
        },
    });
};

export default requestLogger;


