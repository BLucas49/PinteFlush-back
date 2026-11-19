import { NextFunction, Request, Response } from "express";
import { AController } from "../../core/base/Controller.js";
import { getResponse } from "../../core/base/Response.js";
import { UsersService } from "./service.js";

export class UserController extends AController {
  service = new UsersService();
  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userId: string;

      if (!req.params.id) {
        throw new Error("User id requis");
      } else {
        userId = String(req.params.id);
      }

      const response = await this.service.getUserDetails(userId);

      res.status(200).json(getResponse(response));
    } catch (err) {
      next(err);
    }
  };
}
