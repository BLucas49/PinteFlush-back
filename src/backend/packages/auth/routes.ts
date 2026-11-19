import { Router } from "express";
import { AuthController } from "./controller.js";
import { requireAuth } from "../../core/middleware/auth.js";
import { rateLimit } from "../../core/middleware/rateLimit.js";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export function createAuthRoutes(): Router {
  const router = Router();
  const controller = new AuthController();

  router.post(
    "/login",
    rateLimit({ windowMs: FIFTEEN_MINUTES, max: 10 }),
    controller.login,
  );
  router.post(
    "/register",
    rateLimit({ windowMs: FIFTEEN_MINUTES, max: 5 }),
    controller.register,
  );
  router.post(
    "/renew",
    rateLimit({ windowMs: FIFTEEN_MINUTES, max: 30 }),
    controller.renew,
  );

  router.post("/auth/logout", requireAuth, controller.logout);

  return router;
}
