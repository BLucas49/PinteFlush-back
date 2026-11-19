import { Router } from "express";
import { UserController } from "./controller.js";

export function createUserRoutes(): Router {
  const router = Router();
  const userController = new UserController();

  router.get("/:id", userController.getById);

  return router;
}
