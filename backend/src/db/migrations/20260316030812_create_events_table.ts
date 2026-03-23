import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("events", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("title").notNullable();
        table.text("description");
        table.string("location").notNullable();
        table.timestamp("event_date").notNullable();
        table.enu("event_type", ["public", "private"]).defaultTo("public");
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE");
        table.timestamps(true, true);
        table.unique(["title","location","event_date","created_by"]);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("events");
}

