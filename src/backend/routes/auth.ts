import { Router } from "express";
import { createUserRoutes } from "../packages/user/routes.js";

export function createAuthRouter(): Router {
  const router = Router();

  router.use("/user", createUserRoutes());

  return router;
}
