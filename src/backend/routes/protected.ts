import { Router } from "express";
import { createUserRoutes } from "../packages/user/routes.js";

/** Routes accessibles uniquement aux utilisateurs authentifiés (montées derrière requireAuth). */
export function createProtectedRouter(): Router {
  const router = Router();

  router.use("/user", createUserRoutes());

  return router;
}
