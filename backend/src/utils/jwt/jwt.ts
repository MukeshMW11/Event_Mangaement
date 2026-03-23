import jsonwebtoken from 'jsonwebtoken';
import envVariables from "../../config/env.js";
import logError from '../loggers/errorLogger.js';
const { jwtSecret, jwtRefreshSecret } = envVariables;

const generateAccessToken = (userId: string): string => {
    try {
        const token = jsonwebtoken.sign({ userId }, jwtSecret, {
            expiresIn: "1h",
        })
        return token;
    } catch (error) {
        logError(error, { context: "Error generating access token", userId });
        throw new Error("Failed to generate access token");
    }
}


const generateRefreshToken = (userId: string): string => {
    try {
        const refreshtoken = jsonwebtoken.sign({ userId }, jwtRefreshSecret, {
            expiresIn: "7d",
        })
        return refreshtoken;
    }

    catch (error) {
        logError(error, { context: "Error generating refresh token", userId });
        throw new Error("Failed to generate refresh token");
    }
}


const verifyAccessToken = (token: string) => {
    try {

        const decoded = jsonwebtoken.verify(token, jwtSecret);
        return decoded;
    }

    catch (error) {
        logError(error, { context: "Error verifyinh the access token", token });
        throw new Error("Failed to verify access token");
    }
}

const verifyRefreshToken = (token: string) => {
    try {
        const decoded = jsonwebtoken.verify(token, jwtRefreshSecret);
        return decoded;
    }
    catch (error) {
        logError(error, { context: "Error verifying refresh token", token });
        throw new Error("Failed to verify refresh token");
    }
}


export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };