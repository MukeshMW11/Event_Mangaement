import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("email_verification_tokens", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        table.string("token", 64).notNullable().unique();
        table.timestamp("expires_at").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("email_verification_tokens");
}

