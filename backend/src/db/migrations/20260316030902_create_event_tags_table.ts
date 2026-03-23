import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("event_tags", (table) => {
        table.uuid("event_id").references("id").inTable("events").onDelete("CASCADE");
        table.uuid("tag_id").references("id").inTable("tags").onDelete("CASCADE");
        table.primary(["event_id", "tag_id"]);
        table.timestamps(true,true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("event_tags");
}

