import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError.js";
const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof ZodError) {
        req.log.warn({ errors: error.format() }, "Validation Error");
        return res.status(400).json({ message: "Validation Error", errors: error.flatten() });

    }

    if (error instanceof AppError) {
        req.log.warn({ err: error }, error.message);
        return res.status(error.statusCode).json({ message: error.message || "" })
    }


    if (error.code === "23505") {
        req.log.warn({ err: error }, "Unique constraint violation");
        return res.status(409).json({ message: "Resource already exists" });
    }

    const message = typeof error === "string" ? error : error?.message || String(error);
    if (message) {
        req.log.error({ err: error }, "Unhandled error");
        return res.status(500).json({ message: "Internal Server Error" });
    }

    req.log.error({ err: error }, "Internal Server Error");
    return res.status(500).json({ message: "Internal Server Error" });
}


export default errorMiddleware;