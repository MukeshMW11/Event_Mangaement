import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("tags", (table) => {
        table.uuid("created_by").references("id").inTable("users").onDelete("CASCADE");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("tags", (table) => {
        table.dropColumn("created_by");
    });
}

