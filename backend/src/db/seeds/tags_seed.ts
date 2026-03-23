import  type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.transaction(async (trx) => {
        await trx("tags").del();

        await trx("tags").insert([
            { id: "550e8400-e29b-41d4-a716-946655440000", name: "Conference" },
            { id: "550e8400-e29b-41d4-a716-946655440001", name: "Workshop" },
            { id: "550e8400-e29b-41d4-a716-946655440002", name: "Birthday" }
        ]);
    });
};
