import { Router } from "express";
import { UserController } from "./controller.js";

export function createUserRoutes(): Router {
  const router = Router();
  const userController = new UserController();

  // "/me" doit être déclaré avant "/:id"
  router.get("/me", userController.getMe);
  router.get("/:id", userController.getById);

  return router;
}
