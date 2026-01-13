import { IRouter, Router } from "express";
import {
  getAllUsersHandler,
  healthCheckHandler,
} from "../controllers/user/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";
import { Role } from "../constant/enum";

const router: IRouter = Router();

router.get("/me", authMiddleware, healthCheckHandler);
router.get("/", authMiddleware, authorizeRole(Role.ADMIN), getAllUsersHandler);

export default router;
