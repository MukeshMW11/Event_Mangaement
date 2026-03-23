import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.transaction(async (trx) => {

        await trx("event_tags").del();

        await trx("event_tags").insert([
            { event_id: "550e8400-e29b-41d4-a716-546655440000", tag_id: "550e8400-e29b-41d4-a716-946655440000" },
            { event_id: "550e8400-e29b-41d4-a716-546655440001", tag_id: "550e8400-e29b-41d4-a716-946655440001" },
            { event_id: "550e8400-e29b-41d4-a716-546655440002", tag_id: "550e8400-e29b-41d4-a716-946655440002" }
        ]);
    })
};
