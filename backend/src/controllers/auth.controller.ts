import { Request, Response, NextFunction } from "express";
import envVariables from "../config/env.js";
import { generateAccessToken, verifyRefreshToken } from "../utils/index.js";
import { JwtPayload } from "jsonwebtoken";
import { authRepositories } from "../repositories/auth.repository.js";
import { UserAuthRequest } from "../interfaces/auth.interface.js";
import { authServices } from "../services/auth.service.js";
const { node_env } = envVariables;

const authLoginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken, refreshToken, user } = await authServices.authLoginService(req.body);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: node_env === "production",
            sameSite: node_env === "production" ? "strict" : "lax",
            maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: node_env === "production",
            path: "/api/v1/auth/refresh-token",
            sameSite: node_env === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        req.log.info({ userId: user.id }, "User logged in successfully");
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error: any) {
        next(error);
    }
}

const authRegisterController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authServices.authRegisterService(req.body);
        req.log.info({ userId: user.id }, "User registered successfully");
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        next(error);
    }
}


const authRefreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }
        let payload: JwtPayload | string;
        try {

            payload = verifyRefreshToken(refreshToken);
        }
        catch (error) {
            req.log.error("Error occurred while verifying refresh token");
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const { userId } = payload as JwtPayload & { userId: string };
        if (!userId) {
            req.log.error("User ID not found in refresh token payload");
            return res.status(401).json({ message: "Invalid refresh token payload" });
        }
        const newAccessToken = generateAccessToken(userId);
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: node_env === "production",
            sameSite: node_env === "production" ? "strict" : "lax",
            maxAge: 60 * 60 * 1000,
        });
        req.log.info({ userId }, "Access token refreshed successfully");
        res.status(200).json({ message: "Access Token refreshed Successfully" });

    }

    catch (error) {
        next(error);
    }
}



const authLogoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: node_env === "production",
            sameSite: node_env === "production" ? "strict" : "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: node_env === "production",
            sameSite: node_env === "production" ? "strict" : "lax",
            path: "/api/v1/auth/refresh-token",
        });
        req.log.info("User logged out successfully");
        return res.status(200).json({ message: "User logged out successfully" });
    }

    catch (error) {
        next(error);
    }
};


const getCurrentUser = async (req: UserAuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return res.status(401).json({ message: "User unauthorized" });
        const user = await authRepositories.findUserByIdRepository(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { password, ...safeUser } = user;
        return res.status(200).json({ user: safeUser });
    } catch (error) {
        next(error);
    }
}
export const authController = { authLoginController, authRegisterController, authRefreshTokenController, authLogoutController,getCurrentUser };