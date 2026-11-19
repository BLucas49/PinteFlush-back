import { NextFunction, Request, Response } from "express";
import { AError } from "../base/Error.js";
import { getErrorResponse } from "../base/Response.js";
import { NotFoundError } from "../types/errors.js";

/** Erreurs 4xx levées par body-parser (JSON invalide, corps trop volumineux…). */
interface ClientHttpError {
  status: number;
  expose: true;
}

const isClientHttpError = (err: unknown): err is ClientHttpError =>
  typeof err === "object" &&
  err !== null &&
  "status" in err &&
  typeof err.status === "number" &&
  err.status >= 400 &&
  err.status < 500 &&
  "expose" in err &&
  err.expose === true;

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError("Route"));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // Express identifie un middleware d'erreur par ses 4 paramètres
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof AError) {
    res.status(err.statusCode).json(getErrorResponse(err.message));
  } else if (isClientHttpError(err)) {
    res.status(err.status).json(getErrorResponse("Requête invalide"));
  } else {
    console.error("Unexpected error:", err);
    res
      .status(500)
      .json(getErrorResponse("Une erreur inattendue est survenue"));
  }
};
