import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.transaction(async (trx) => {

        await trx("events").del();

        await trx("events").insert([
            { id: "550e8400-e29b-41d4-a716-546655440000", title: "Roman Reigns Birthday", description: "Birthday event for Reigns birthday", location: "Florida, FL", event_date: "2026-10-15 10:00:00", event_type: "private", created_by: "550e8400-e29b-41d4-a716-446655440000" },
            { id: "550e8400-e29b-41d4-a716-546655440001", title: "Node js Workshop ", description: "Workshop for Node js version 25", location: "New York, NY", event_date: "2027-11-20 10:00:00", created_by: "550e8400-e29b-41d4-a716-446655440001" },
            { id: "550e8400-e29b-41d4-a716-546655440002", title: "React Conference", description: "The react conference for 2027", location: "San Francisco, CA", event_date: "2027-03-15 10:00:00", created_by: "550e8400-e29b-41d4-a716-446655440002" }
        ]);
    });
};
