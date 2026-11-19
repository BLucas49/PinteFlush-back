import { NextFunction, Request, Response } from "express";
import { AController } from "../../core/base/Controller.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthService } from "./service.js";
import { BadRequestError, UnauthorizedError } from "../../core/types/errors.js";
import { AuthenticatedRequest } from "../../core/base/AutenticatedRequest.js";

export class AuthController extends AController {
  service = new AuthService();
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError();
      }

      const user = await this.service.checkCredentials(email, password);

      const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1Hour",
      });

      const refreshToken = await this.service.createRefresh(user.id);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.ENV === "production", // HTTPS uniquement en prod
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1h
        path: "/",
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === "production", // HTTPS uniquement en prod
        sameSite: "strict",
        maxAge: 6 * 31 * 24 * 60 * 60 * 1000, // 6 mois
        path: "/api/renew",
      });
      res.json({ user: { id: user.id, email: user.email } });
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        throw new BadRequestError();
      }

      await this.service.isValidUser(password, email);
      await this.service.createUser(password, email, firstName, lastName);

      res.sendStatus(201);
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
      res.clearCookie("access_token", { path: "/" });
      res.clearCookie("refresh_token", { path: "/api/renew" });

      await this.service.revokeSession(req.user.id);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  public renew = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.cookies.refresh_token;
      if (!token) throw new UnauthorizedError();

      const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      const accessToken = jwt.sign(
        { sub: payload.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: "1Hour",
        },
      );

      const refreshToken = await this.service.createRefresh(payload.userId);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.ENV === "production", // HTTPS uniquement en prod
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1h
        path: "/",
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === "production", // HTTPS uniquement en prod
        sameSite: "strict",
        maxAge: 6 * 31 * 24 * 60 * 60 * 1000, // 6 mois
        path: "/api/renew",
      });
    } catch (err) {
      next(err);
    }
  };
}
