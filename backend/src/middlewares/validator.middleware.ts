import { Request, Response, NextFunction } from "express"
import { ZodType,prettifyError} from "zod";

const validateData = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            req.log.warn({
                error: prettifyError(result.error),
                path: req.path,

            }
                , "validation failed"
            )

            return res.status(400).json({ message: "Validation failed", error: result.error.format() })
        }

        req.body = result.data;
        next();
    }
}


export default validateData;