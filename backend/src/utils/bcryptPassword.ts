import bcrypt from "bcryptjs";


const SALT_ROUNDS = 10;


const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    }
    catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Failed to hash password");
    }
}



const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }

    catch (error) {
        console.error("Error comparing password:", error);
        throw new Error("Failed to compare password");
    }
}

export { hashPassword, comparePassword };