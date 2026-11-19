import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../base/AuthenticatedRequest.js";
import { UnauthorizedError } from "../types/errors.js";
import { ACCESS_COOKIE } from "../utils/cookies.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const requireAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token: unknown = req.cookies?.[ACCESS_COOKIE];
  const userId = typeof token === "string" ? verifyAccessToken(token) : null;

  if (userId === null) {
    next(new UnauthorizedError("Authentification requise"));
    return;
  }

  req.user = { id: userId };
  next();
};

/** Id de l'utilisateur authentifié (à utiliser derrière requireAuth). */
export const getAuthUserId = (req: AuthenticatedRequest): string => {
  if (!req.user) throw new UnauthorizedError("Authentification requise");
  return req.user.id;
};
