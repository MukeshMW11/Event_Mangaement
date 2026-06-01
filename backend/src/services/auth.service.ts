import { comparePassword, hashPassword } from "../utils/bcryptPassword.js";
import { loginType, registerType } from "../validators/auth.validators.js";
import { AppError, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/index.js";
import { authRepositories } from "../repositories/auth.repository.js";
import { JwtPayload } from "jsonwebtoken";

const authLoginService = async (data: loginType) => {


    try {

        const user = await authRepositories.findUserByEmailRepository(data.email);
        if (!user) {
            throw new AppError("Invalid credentails", 401);
        }
        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", 401);
        }
        if (user.verified_at === null) {
            throw new AppError("Please verify your email", 403);
        }
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        const { password: _, ...safeUser } = user;

        return { accessToken, refreshToken, user: safeUser };
    }

    catch (error) {
        throw error;
    }


}
const authRegisterService = async (data: registerType) => {
    const existingUser = await authRepositories.findUserByEmailRepository(data.email);
    if (existingUser) {
        throw new AppError("Account with this email already exists", 409);
    }
    const hashedPassword = await hashPassword(data.password);
    try {
        const user = await authRepositories.authRegisterRepository({ name: data.name, email: data.email, password: hashedPassword });
        return user;
    }
    catch (error: any) {
        throw error;
    }

}


const authRefreshTokenService = async (refreshToken: string) => {
    let payload: JwtPayload | string;
    try {
        payload = verifyRefreshToken(refreshToken);
        const { userId } = payload as JwtPayload & { userId: string };
        if (!userId) {
            throw new AppError("Invalid refresh token payload", 401);
        }
        const newAccessToken = generateAccessToken(userId);
        return { newAccessToken, userId };

    }
    catch (error) {
        throw new AppError("Invalid refresh token", 401);
    }


}



export const authServices = { authLoginService, authRegisterService, authRefreshTokenService };