import dotenv from "dotenv";
import { Pool } from "pg";
import { RepositoryManager } from "../../db/RepositoryManager.js";

export const InitApi = () => {
  dotenv.config();

  new RepositoryManager(
    new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    }),
  );
};
