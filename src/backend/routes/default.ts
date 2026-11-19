import { Router } from "express";
import { createAuthRouter } from "./auth.js";
import { createAuthRoutes } from "../packages/auth/routes.js";
import { requireAuth } from "../core/middleware/auth.js";
import { errorHandler } from "../core/middleware/error.js";

export function createAppRoutes(): Router {
  const router = Router();

  router.use("/auth", requireAuth, createAuthRouter());
  router.use("/", createAuthRoutes());

  router.use(errorHandler);
  return router;
}
