import { IResponse } from "../../core/base/Response.js";
import { readEmail, readString } from "../../core/utils/validation.js";

export const PASSWORD_MIN_LENGTH = 20;
/** bcrypt ignore tout ce qui dépasse 72 octets. */
export const PASSWORD_MAX_BYTES = 72;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthUserResponse extends IResponse {
  user: { id: string; email: string };
}

export interface RegisterResponse extends IResponse {
  id: string;
}

export function parseLoginInput(body: unknown): LoginInput {
  return {
    email: readEmail(body),
    password: readString(body, "password", { max: 256, trim: false }),
  };
}

export function parseRegisterInput(body: unknown): RegisterInput {
  return {
    email: readEmail(body),
    password: readString(body, "password", {
      min: PASSWORD_MIN_LENGTH,
      max: PASSWORD_MAX_BYTES,
      trim: false,
    }),
    firstName: readString(body, "firstName", { max: 100 }),
    lastName: readString(body, "lastName", { max: 100 }),
  };
}
