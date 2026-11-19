import { AError } from "../base/Error.js";

export class NotFoundError extends AError {
  constructor(resource: string) {
    super(`${resource} introuvable`, 404);
  }
}

export class BadRequestError extends AError {
  constructor(message = "Mauvaise structure de donnée") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AError {
  constructor(message = "Action non autorisée") {
    super(message, 401);
  }
}

export class ConflictError extends AError {
  constructor(message = "La ressource existe déjà") {
    super(message, 409);
  }
}

export class TooManyRequestsError extends AError {
  constructor(message = "Trop de tentatives, réessayez plus tard") {
    super(message, 429);
  }
}

export class InternalServerError extends AError {
  constructor(message = "Une erreur inattendue est survenue") {
    super(message, 500);
  }
}
