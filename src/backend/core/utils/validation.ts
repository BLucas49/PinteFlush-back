import { BadRequestError } from "../types/errors.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface StringRules {
  min?: number;
  max?: number;
  trim?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function readString(
  body: unknown,
  field: string,
  { min = 1, max = 255, trim = true }: StringRules = {},
): string {
  const raw = isRecord(body) ? body[field] : undefined;
  if (typeof raw !== "string") {
    throw new BadRequestError(`Le champ "${field}" est manquant ou invalide`);
  }

  const value = trim ? raw.trim() : raw;
  if (value.length < min || value.length > max) {
    throw new BadRequestError(
      `Le champ "${field}" doit contenir entre ${min} et ${max} caractères`,
    );
  }
  return value;
}

export function readEmail(body: unknown): string {
  const email = readString(body, "email", { max: 254 }).toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    throw new BadRequestError("Adresse email invalide");
  }
  return email;
}

export function assertUuid(value: unknown, field = "id"): string {
  if (typeof value !== "string" || !UUID_REGEX.test(value)) {
    throw new BadRequestError(`Le paramètre "${field}" doit être un UUID`);
  }
  return value;
}
