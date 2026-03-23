import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("rsvps",(table)=>{
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.uuid("event_id").references("id").inTable("events").onDelete("CASCADE");
        table.enum("status",["yes","no", "maybe"]).notNullable();
        table.unique(["user_id","event_id"]);
        table.timestamps(true,true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("rsvps");
}

