import type { Knex } from "knex";
import "dotenv/config";

const config: { [key: string]: Knex.Config } = {

  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 0,
      max: 7
    },
    migrations: {
      directory: "./src/db/migrations",
      extension: "ts"
    },
    seeds: {
      directory: "./src/db/seeds",
      extension: "ts"

    }
  }

};

export default config;
