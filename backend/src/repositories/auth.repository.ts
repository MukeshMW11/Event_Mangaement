import { registerType } from "../validators/auth.validators.js";
import db from "../db/knex.js";

const findUserByIdRepository = async (id: string) => {
    return await db("users").where({ id }).first();
}



const authRegisterRepository = async (data: registerType) => {
    const user = await db("users").insert(data).returning(["id", "name", "email", "created_at"]);
    return user;
}


const findUserByEmailRepository = async (email: string) => {
    return await db("users").where({ email }).first();
}



export const authRepositories =  { authRegisterRepository, findUserByEmailRepository, findUserByIdRepository };