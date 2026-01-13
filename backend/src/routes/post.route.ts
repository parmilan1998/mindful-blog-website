import { IRouter, Router } from "express";
import {
  createPostHandler,
  deletePostHandler,
  getAllPostsHandler,
  getSinglePostHandler,
  updatePostHandler,
} from "../controllers/post/post.controller";
import authMiddleware from "../middleware/auth.middleware";
import { Role } from "../constant/enum";
import authorizeRole from "../middleware/role.middleware";

const router: IRouter = Router();

router.post("/", authMiddleware, createPostHandler);
router.put("/", authMiddleware, updatePostHandler);

router.get("/", getAllPostsHandler);
router.get("/:id", getSinglePostHandler);

router.delete("/:id", authMiddleware, deletePostHandler);

export default router;
