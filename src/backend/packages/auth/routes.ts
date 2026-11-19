import { Router } from "express";
import { AuthController } from "./controller.js";
import { requireAuth } from "../../core/middleware/auth.js";

export function createAuthRoutes(): Router {
  const router = Router();
  const controller = new AuthController();

  router.post("/login", controller.login);
  router.post("/register", controller.register);

  router.post("/auth/logout", requireAuth, controller.logout);

  router.post("/renew", controller.renew);
  return router;
}
