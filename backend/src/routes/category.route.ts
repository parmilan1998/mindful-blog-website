import { Router } from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoryHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "../controllers/category/category.controller";
// import authMiddleware from "../middleware/auth.middleware";
// import authorizeRole from "../middleware/role.middleware";
// import { Role } from "../constant/enum";
import { upload } from "../config/cloudinary";

const router = Router();

router.post(
  "/",
  // authMiddleware,
  // authorizeRole(Role.ADMIN),
  upload.single("image"),
  createCategoryHandler
);
router.put(
  "/",
  // authMiddleware,
  // authorizeRole(Role.ADMIN),
  upload.single("image"),
  updateCategoryHandler
);
router.get("/", getAllCategoryHandler);
router.get("/:id", getCategoryHandler);
router.delete(
  "/:id",
  // authMiddleware,
  // authorizeRole(Role.ADMIN),
  deleteCategoryHandler
);

export default router;
