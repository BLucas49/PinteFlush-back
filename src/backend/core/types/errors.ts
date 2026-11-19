import { AError } from "../base/Error.js";

export class NotFoundError extends AError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class BadRequestError extends AError {
  constructor(message = "Mauvaise structure de donnée") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AError {
  constructor(message = "Action non authorisée") {
    super(message, 401);
  }
}

export class InternalServerError extends AError {
  constructor(message = "Une erreur inatendue est survenue") {
    super(message, 500);
  }
}

export class ExpiredTokenError extends AError {
  constructor() {
    super("Token expiré", 498);
  }
}
