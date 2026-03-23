import  type { Knex } from "knex";
import { hashPassword } from "../../utils/bcryptPassword.js";


export async function seed(knex: Knex): Promise<void> {

    await knex.transaction(async (trx) => {

        await trx("users").del();
        const johnPassword = await hashPassword("john123");
        const randyPassword = await hashPassword("randy123");
        const romanPassword = await hashPassword("roman123");

        await trx("users").insert([
            { id: "550e8400-e29b-41d4-a716-446655440000", name: "John Smith", email: "john@gmail.com", password: johnPassword },
            { id: "550e8400-e29b-41d4-a716-446655440001", name: "Randy Orton", email: "randy@gmail.com", password: randyPassword },
            { id: "550e8400-e29b-41d4-a716-446655440002", name: "Roman Reigns", email: "roman@gmail.com", password: romanPassword }
        ]);
    })
};
