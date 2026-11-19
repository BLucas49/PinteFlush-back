import { NextFunction, Request, Response } from "express";
import { AController } from "../../core/base/Controller.js";
import { AuthenticatedRequest } from "../../core/base/AuthenticatedRequest.js";
import { getResponse } from "../../core/base/Response.js";
import { getAuthUserId } from "../../core/middleware/auth.js";
import { UnauthorizedError } from "../../core/types/errors.js";
import {
  clearAuthCookies,
  REFRESH_COOKIE,
  setAuthCookies,
} from "../../core/utils/cookies.js";
import {
  AuthUserResponse,
  parseLoginInput,
  parseRegisterInput,
  RegisterResponse,
} from "./dto.js";
import { AuthService } from "./service.js";

export class AuthController extends AController {
  protected readonly service = new AuthService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, tokens } = await this.service.login(
        parseLoginInput(req.body),
      );

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      res.json(
        getResponse<AuthUserResponse>({
          user: { id: user.id, email: user.email },
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await this.service.register(parseRegisterInput(req.body));

      res.status(201).json(getResponse<RegisterResponse>({ id }));
    } catch (err) {
      next(err);
    }
  };

  public logout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.service.logout(getAuthUserId(req));

      clearAuthCookies(res);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  public renew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: unknown = req.cookies?.[REFRESH_COOKIE];
      if (typeof token !== "string" || token.length === 0) {
        throw new UnauthorizedError("Session expirée, reconnectez-vous");
      }

      const tokens = await this.service.renew(token);

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      res.sendStatus(204);
    } catch (err) {
      if (err instanceof UnauthorizedError) clearAuthCookies(res);
      next(err);
    }
  };
}
