import dotenv from "dotenv";
import { Pool, PoolConfig } from "pg";
import { RepositoryManager } from "../../db/RepositoryManager.js";

export interface ApiEnv {
  jwtSecret: string;
  isProduction: boolean;
  db: PoolConfig;
}

const REQUIRED_VARS = [
  "JWT_SECRET",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
] as const;

type RequiredVar = (typeof REQUIRED_VARS)[number];

const JWT_SECRET_MIN_LENGTH = 32;

let env: ApiEnv | null = null;

const readVar = (name: RequiredVar): string => process.env[name] ?? "";

const loadEnv = (): ApiEnv => {
  dotenv.config({ quiet: true });

  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes : ${missing.join(", ")}`,
    );
  }

  const jwtSecret = readVar("JWT_SECRET");
  if (jwtSecret.length < JWT_SECRET_MIN_LENGTH) {
    throw new Error(
      `JWT_SECRET doit contenir au moins ${JWT_SECRET_MIN_LENGTH} caractères`,
    );
  }

  return {
    jwtSecret,
    isProduction:
      process.env.ENV === "production" || process.env.NODE_ENV === "production",
    db: {
      user: readVar("DB_USER"),
      password: readVar("DB_PASSWORD"),
      host: readVar("DB_HOST"),
      port: Number(readVar("DB_PORT")),
      database: readVar("DB_NAME"),
    },
  };
};

/** Configuration validée, chargée une seule fois. Lève une erreur explicite si une variable manque. */
export const getEnv = (): ApiEnv => {
  env ??= loadEnv();
  return env;
};

export const InitApi = () => {
  const repositoryManager = new RepositoryManager(new Pool(getEnv().db));
  void repositoryManager.verifyConnection();
};
