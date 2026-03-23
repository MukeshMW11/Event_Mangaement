import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.transaction(async (trx) => {
        await trx("rsvps").del();

        await trx("rsvps").insert([
            { id: "550e8400-e29b-41d4-a716-846655440000", event_id: "550e8400-e29b-41d4-a716-546655440000", user_id: "550e8400-e29b-41d4-a716-446655440000", status: "yes" },
            { id: "550e8400-e29b-41d4-a716-846655440001", event_id: "550e8400-e29b-41d4-a716-546655440001", user_id: "550e8400-e29b-41d4-a716-446655440001", status: "no" },
            { id: "550e8400-e29b-41d4-a716-846655440002", event_id: "550e8400-e29b-41d4-a716-546655440002", user_id: "550e8400-e29b-41d4-a716-446655440002", status: "maybe" }
        ]);
    });
};
