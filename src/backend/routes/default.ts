import express, { Router } from "express";
import cookieParser from "cookie-parser";
import { createProtectedRouter } from "./protected.js";
import { createAuthRoutes } from "../packages/auth/routes.js";
import { requireAuth } from "../core/middleware/auth.js";
import { errorHandler, notFoundHandler } from "../core/middleware/error.js";

export function createAppRoutes(): Router {
  const router = Router();

  // Parsers montés ici pour que leurs erreurs (JSON invalide…) passent par errorHandler
  router.use(express.json({ limit: "100kb" }));
  router.use(cookieParser());

  // Routes publiques (+ /auth/logout, protégée individuellement)
  router.use("/", createAuthRoutes());
  router.use("/auth", requireAuth, createProtectedRouter());

  router.use(notFoundHandler);
  router.use(errorHandler);
  return router;
}
