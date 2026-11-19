import { NextFunction, Response } from "express";
import { AController } from "../../core/base/Controller.js";
import { AuthenticatedRequest } from "../../core/base/AuthenticatedRequest.js";
import { getResponse } from "../../core/base/Response.js";
import { getAuthUserId } from "../../core/middleware/auth.js";
import { assertUuid } from "../../core/utils/validation.js";
import { UsersService } from "./service.js";

export class UserController extends AController {
  protected readonly service = new UsersService();

  public getMe = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const requesterId = getAuthUserId(req);
      const profile = await this.service.getProfile(requesterId, requesterId);

      res.json(getResponse(profile));
    } catch (err) {
      next(err);
    }
  };

  public getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = assertUuid(req.params.id);
      const profile = await this.service.getProfile(userId, getAuthUserId(req));

      res.json(getResponse(profile));
    } catch (err) {
      next(err);
    }
  };
}
