import db from "../db/knex.js";

const markEmailAsVerified = async (userId: number) => {
    await db("users").where({ id: userId }).update({ verified_at: new Date() });
};

const deleteExistingTokensByUserId = async (userId: number) => {
    await db("email_verification_tokens").where({ user_id: userId }).delete();
};

const deleteExistingTokensByUserToken = async (token: string) => {
    await db("email_verification_tokens").where({ token }).delete();
};

const findValidToken = async (token: string) => {
    return await db("email_verification_tokens").where({ token }).first();
};

const createVerificationToken = async (userId: number, token: string, expires_at: Date) => {
    await db("email_verification_tokens").insert({ user_id: userId, token, expires_at });
};

export const verificationRepositories = { markEmailAsVerified, deleteExistingTokensByUserId, deleteExistingTokensByUserToken, findValidToken, createVerificationToken }