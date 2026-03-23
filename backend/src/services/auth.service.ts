import { comparePassword, hashPassword } from "../utils/bcryptPassword.js";
import { loginType, registerType } from "../validators/auth.validators.js";
import { AppError, generateAccessToken, generateRefreshToken } from "../utils/index.js";
import { authRepositories } from "../repositories/auth.repository.js";

const authLoginService = async (data: loginType) => {
    const user = await authRepositories.findUserByEmailRepository(data.email);
    if (!user) {
        throw new AppError("Invalid credentails", 401);
    }
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const { password: _, ...safeUser } = user;

    return { accessToken, refreshToken, user: safeUser };


}
const authRegisterService = async (data: registerType) => {
    const existingUser = await authRepositories.findUserByEmailRepository(data.email);
    if (existingUser) {
        throw new AppError("Account with this email already exists", 400);
    }
    const hashedPassword = await hashPassword(data.password);
    try {
        const user = await authRepositories.authRegisterRepository({ ...data, password: hashedPassword });
        return user;
    }
    catch (error: any) {
        if (error.code === "23505") {
            throw new AppError("Account with this email already exists", 409);
        }
        throw error;
    }

}



export const authServices =  { authLoginService, authRegisterService };