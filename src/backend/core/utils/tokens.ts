import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/config.js";

export const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h
export const REFRESH_TOKEN_TTL_MS = 24 * 7 * 24 * 60 * 60 * 1000; // 24 semaines

const JWT_ALGORITHM = "HS256";

export const signAccessToken = (userId: string): string =>
  jwt.sign({}, getEnv().jwtSecret, {
    subject: userId,
    expiresIn: ACCESS_TOKEN_TTL_MS / 1000,
    algorithm: JWT_ALGORITHM,
  });

/** Renvoie l'id utilisateur contenu dans le token, ou null s'il est invalide ou expiré. */
export const verifyAccessToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, getEnv().jwtSecret, {
      algorithms: [JWT_ALGORITHM],
    });
    return typeof payload === "object" && typeof payload.sub === "string"
      ? payload.sub
      : null;
  } catch {
    return null;
  }
};

/**
 * Refresh token opaque (et non un JWT) : il ne peut pas être confondu avec un access token,
 * et seule son empreinte SHA-256 est stockée en base.
 */
export const generateRefreshToken = (): string =>
  crypto.randomBytes(32).toString("base64url");

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");
