import { Request, Response, NextFunction } from "express";
import { logError, verifyAccessToken } from "../utils/index.js";


interface AuthRequest extends Request {
    user?: {userId:string}
}

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    try {
        const decoded = verifyAccessToken(accessToken);
        req.user = {userId:decoded.userId};
        next();
    }

    catch (error) {
        logError(error, { route: "auth-middleware", handler: "authenticateUser" });
        return res.status(401).json({ message: "Invalid or expired  access token" });
    }

};


export default authenticateUser;